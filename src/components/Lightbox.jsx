import React, { useEffect, useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { X, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
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
        };
    }, [image, onClose]);

    if (!image) return null;

    return (
        <div className="lightbox-overlay">
            <div className="lightbox-controls">
                <button onClick={onClose} className="close-btn" aria-label="Close">
                    <X size={32} />
                </button>
            </div>

            <div className="lightbox-content-wrapper">
                <TransformWrapper
                    initialScale={1}
                    minScale={0.5}
                    maxScale={4}
                    centerOnInit
                >
                    {({ zoomIn, zoomOut, resetTransform }) => (
                        <>
                            <div className="zoom-controls">
                                <button onClick={() => zoomIn()}><ZoomIn size={24} /></button>
                                <button onClick={() => zoomOut()}><ZoomOut size={24} /></button>
                                <button onClick={() => resetTransform()}><Maximize size={24} /></button>
                            </div>
                            <TransformComponent wrapperClass="transform-wrapper" contentClass="transform-content">
                                <img
                                    src={currentSrc}
                                    alt={image.title}
                                    className={`lightbox-image ${isHighResLoaded ? 'high-res' : 'low-res'}`}
                                />
                            </TransformComponent>
                        </>
                    )}
                </TransformWrapper>
            </div>

            <div className="lightbox-details" onClick={(e) => e.stopPropagation()}>
                <h2>
                    {image.title}
                    {image.date && <span style={{ margin: '0 10px', color: '#fff', opacity: 0.8 }}>{image.date}</span>}
                    <span style={{ margin: '0 10px', opacity: 0.5 }}>—</span>
                    <span style={{ fontWeight: 300, color: '#ddd' }}>{image.artist}</span>
                </h2>
            </div>
        </div>
    );
};

export default Lightbox;
