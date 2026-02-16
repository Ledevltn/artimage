import React from 'react';
import { Search, Filter } from 'lucide-react';
import './Header.css';

const Header = ({ searchTerm, setSearchTerm, filterType, setFilterType }) => {
    const filters = [
        { value: '', label: 'All Artworks' },
        { value: 'Painting', label: 'Paintings' },
        { value: 'Sculpture', label: 'Sculptures' },
        { value: 'Photograph', label: 'Photos' },
        { value: 'Print', label: 'Prints' },
        { value: 'Drawing', label: 'Drawings' },
        { value: 'Textile', label: 'Textiles' }
    ];

    return (
        <header className="app-header">
            <div className="search-wrapper">
                <div className="search-container">
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        placeholder="Search for beauty..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
                <div className="filter-container">
                    <Filter className="filter-icon" size={16} />
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="filter-select"
                        aria-label="Filter by type"
                    >
                        {filters.map(f => (
                            <option key={f.value} value={f.value}>{f.label}</option>
                        ))}
                    </select>
                </div>

                <a
                    href="https://buymeacoffee.com/ledevltn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="coffee-link"
                    title="Soutenir le projet"
                >
                    <span>Soutenir le projet</span>
                </a>
            </div>
        </header>
    );
};

export default Header;
