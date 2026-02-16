import React from 'react';
import './SkeletonCard.css';

const SkeletonCard = () => {
    return (
        <div className="skeleton-card">
            <div className="skeleton-image"></div>
            <div className="skeleton-text title"></div>
            <div className="skeleton-text subtitle"></div>
        </div>
    );
};

export default SkeletonCard;
