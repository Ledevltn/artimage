import React, { useMemo, useState, useEffect } from 'react';
import './ImageGrid.css';
import SkeletonCard from './SkeletonCard';

const ImageItem = ({ art, onClick, onImageError }) => {
    const [loaded, setLoaded] = useState(false);
    const aspectRatio = (art.height && art.width) ? (art.height / art.width) : 1;

    return (
        <div className="grid-item scale-up" onClick={() => onClick(art)}>
            <div className="image-card" style={{ position: 'relative' }}>
                {/* Spacer to maintain aspect ratio */}
                <div style={{ paddingBottom: `${aspectRatio * 100}%`, width: '100%', position: 'relative' }}></div>

                {/* Skeleton Loader (absolute, behind image) */}
                {!loaded && (
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                        <SkeletonCard />
                    </div>
                )}

                {/* Image (absolute, fades in) */}
                <img
                    src={art.url}
                    alt={art.title}
                    loading="lazy"
                    className="art-image"
                    style={{
                        opacity: loaded ? 1 : 0,
                        transition: 'opacity 0.5s ease',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }}
                    onLoad={() => setLoaded(true)}
                    onError={() => onImageError(art.id)}
                />

                {/* Overlay Info (absolute) */}
                <div className="art-info" style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.5s ease' }}>
                    <h3 className="art-title">
                        {art.title}
                        {art.date && <span style={{ marginLeft: '10px', color: '#fff' }}>{art.date}</span>}
                    </h3>
                    <p className="art-artist">{art.artist}</p>
                </div>
            </div>
        </div>
    );
};

const ImageGrid = ({ images, onImageClick }) => {
    // Determine number of columns based on window width
    const [numCols, setNumCols] = useState(3);
    const [failedImages, setFailedImages] = useState(new Set());

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 600) setNumCols(1);
            else if (window.innerWidth < 1200) setNumCols(2);
            else setNumCols(3);
        };

        // Initial call
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const validImages = useMemo(() => {
        return images.filter(img => !failedImages.has(img.id));
    }, [images, failedImages]);

    // Distribute images into columns using Shortest Column First algorithm
    const columns = useMemo(() => {
        // Create an array of arrays for columns
        const cols = Array.from({ length: numCols }, () => []);
        // Create an array to track the *height ratio* of each column
        // We assume width is standard (1 unit), so we just add height/width ratios.
        // Start all at 0.
        const colHeights = new Array(numCols).fill(0);

        validImages.forEach((art) => {
            // Find index of the shortest column
            let shortestColIndex = 0;
            let minHeight = colHeights[0];

            for (let i = 1; i < numCols; i++) {
                if (colHeights[i] < minHeight) {
                    minHeight = colHeights[i];
                    shortestColIndex = i;
                }
            }

            // Add image to that column
            cols[shortestColIndex].push(art);

            // Update that column's height
            // We use aspect ratio (height / width) as a proxy for visual height
            // If dimensions missing, assume square (1)
            const aspectRatio = (art.height && art.width)
                ? (art.height / art.width)
                : 1;

            colHeights[shortestColIndex] += aspectRatio;
        });

        return cols;
    }, [validImages, numCols]);

    const handleImageError = (id) => {
        setFailedImages(prev => {
            const next = new Set(prev);
            next.add(id);
            return next;
        });
    };

    if (images.length === 0) {
        return <div className="no-results">No beauty found for these terms.</div>;
    }

    return (
        <div className="masonry-container">
            {columns.map((col, colIndex) => (
                <div key={colIndex} className="masonry-column">
                    {col.map((art) => (
                        <ImageItem
                            key={art.id}
                            art={art}
                            onClick={onImageClick}
                            onImageError={handleImageError}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default ImageGrid;
