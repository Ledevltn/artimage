import { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header';
import ImageGrid from './components/ImageGrid';
import Lightbox from './components/Lightbox';

// Cleveland Museum of Art API
const API_BASE_URL = "https://openaccess-api.clevelandart.org/api/artworks/";

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
  const observerTarget = useRef(null);

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
      setImages([]);
      setHasMore(true);
      setError(null);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch Logic
  const fetchArtworks = useCallback(async (pageNum, query) => {
    setLoading(true);
    setError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    try {
      const limit = 50;
      const skip = (pageNum - 1) * limit;
      const q = query.trim();

      let url = `${API_BASE_URL}?has_image=1&limit=${limit}&skip=${skip}`;
      if (q) url += `&q=${encodeURIComponent(q)}`;
      else url += `&q=painting`;

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error('API Error');

      const data = await response.json();

      if (data && data.data) {
        const newArtworks = data.data
          .filter(item => item.images && item.images.web)
          .map(item => ({
            id: item.id,
            title: item.title,
            artist: item.creators && item.creators.length > 0 ? item.creators[0].description : "Unknown Artist",
            date: item.creation_date || item.date_text || "",
            url: item.images.web.url,
            // Capture dimensions for masonry layout
            width: item.images.web.width ? parseInt(item.images.web.width) : 100,
            height: item.images.web.height ? parseInt(item.images.web.height) : 100,
            fullUrl: item.images.print ? item.images.print.url : item.images.web.url
          }));

        if (newArtworks.length === 0) {
          setHasMore(false);
        } else {
          setImages(prev => {
            // Deduplicate to avoid key clashes
            const existingIds = new Set(prev.map(p => p.id));
            const uniqueNew = newArtworks.filter(a => !existingIds.has(a.id));
            return pageNum === 1 ? newArtworks : [...prev, ...uniqueNew];
          });
        }
      } else {
        setHasMore(false);
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        console.error("Fetch timed out");
        setError("Connection timed out. Please check your internet.");
      } else {
        console.error("Failed to fetch artworks", err);
        setError("Unable to load artworks. Please reload.");
      }
    } finally {
      setLoading(false);
      clearTimeout(timeoutId);
    }
  }, []);

  useEffect(() => {
    if (hasMore && !error) {
      fetchArtworks(page, debouncedSearch);
    }
  }, [page, debouncedSearch, fetchArtworks, hasMore, error]);

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore && !error) {
          setPage(prev => prev + 1);
        }
      },
      // rootMargin: '2500px' triggers the loading when the user is 2500px away from the bottom
      // This is aggressive pre-fetching to ensure seamless flow.
      { rootMargin: '2500px', threshold: 0 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loading, hasMore, error]);

  const handleImageClick = (art) => {
    setSelectedImage(art);
  };

  return (
    <div className="app">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <main>
        {/* Only show grid if we have images OR if we are not in a loading/error state (to show 'empty' message) */}
        {(images.length > 0 || (!loading && !error)) && (
          <ImageGrid
            images={images}
            onImageClick={handleImageClick}
          />
        )}

        {/* Loading / Sentinel */}
        <div ref={observerTarget} style={{ height: '100px', margin: '20px 0', textAlign: 'center', color: '#666' }}>
          {loading && <p>Loading masterpiece collection...</p>}
          {error && (
            <div style={{ padding: '20px' }}>
              <p style={{ color: '#ff6b6b', marginBottom: '10px' }}>{error}</p>
              <button
                onClick={() => fetchArtworks(page, debouncedSearch)}
                style={{
                  padding: '8px 16px',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'white',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Try Again
              </button>
            </div>
          )}
          {!hasMore && !loading && !error && <p>End of collection.</p>}
        </div>
      </main>

      {selectedImage && (
        <Lightbox
          key={selectedImage.id}
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
}

export default App;
