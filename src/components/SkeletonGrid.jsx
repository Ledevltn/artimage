import React from 'react';
import SkeletonCard from './SkeletonCard';
import './ImageGrid.css'; // Reuse grid styles if possible, or define new ones

const SkeletonGrid = () => {
    // Create an array of 15 items for the skeleton placeholders
    const skeletons = Array.from({ length: 15 });

    return (
        <div className="masonry-container">
            {/* We can simulating columns for a roughly similar look, 
          or just a simple flex wrap since we don't have real heights yet.
          Actually, let's just make 3 columns manually to match the real grid.
      */}
            <div className="masonry-column">
                {skeletons.slice(0, 5).map((_, i) => (
                    <div key={i} className="grid-item" style={{ marginBottom: '20px', aspectRatio: '3/4' }}>
                        <SkeletonCard />
                    </div>
                ))}
            </div>
            <div className="masonry-column">
                {skeletons.slice(5, 10).map((_, i) => (
                    <div key={i} className="grid-item" style={{ marginBottom: '20px', aspectRatio: '4/3' }}>
                        <SkeletonCard />
                    </div>
                ))}
            </div>
            <div className="masonry-column">
                {skeletons.slice(10, 15).map((_, i) => (
                    <div key={i} className="grid-item" style={{ marginBottom: '20px', aspectRatio: '1/1' }}>
                        <SkeletonCard />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SkeletonGrid;
