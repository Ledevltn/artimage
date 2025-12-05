import React from 'react';
import { Search } from 'lucide-react';
import './Header.css';

const Header = ({ searchTerm, setSearchTerm }) => {
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
            </div>
        </header>
    );
};

export default Header;
