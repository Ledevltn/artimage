import React, { useEffect, useState } from 'react';
import './Lightbox.css';

const Lightbox = ({ image, onClose }) => {
    const [currentSrc, setCurrentSrc] = useState(image.url); // Start with fast Web URL
    const [isHighResLoaded, setIsHighResLoaded] = useState(false);

    useEffect(() => {
        // Progressive loading of High Res
        if (image.fullUrl && image.fullUrl !== image.url) {
            const img = new Image();
            img.src = image.fullUrl;
            img.onload = () => {
                setCurrentSrc(image.fullUrl);
                setIsHighResLoaded(true);
            };
        }

        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'auto';
            // Cleanup image object? JS GC handles it usually.
        };
    }, [image, onClose]);

    if (!image) return null;

    return (
        <div className="lightbox-overlay" onClick={onClose}>
            <div className="lightbox-content">
                <img
                    src={currentSrc}
                    alt={image.title}
                    className={`lightbox-image ${isHighResLoaded ? 'high-res' : 'low-res'}`}
                    onClick={onClose} // Clicking image closes it
                    style={{ cursor: 'zoom-out' }}
                />
                <div className="lightbox-details" onClick={(e) => e.stopPropagation()}>
                    <h2>
                        {image.title}
                        {image.date && <span style={{ margin: '0 10px', color: '#fff', opacity: 0.8 }}>{image.date}</span>}
                        <span style={{ margin: '0 10px', opacity: 0.5 }}>—</span>
                        <span style={{ fontWeight: 300, color: '#ddd' }}>{image.artist}</span>
                    </h2>
                </div>
            </div>
        </div>
    );
};

export default Lightbox;
