import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../componentStyles/Navbar.css';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import '../pageStyles/search.css';

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const isAuthenticated = true; // Ideally from global state (e.g., Redux or Context)
    const cartCount = 6; // Replace with dynamic logic later

    const navigate = useNavigate();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
           navigate(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            navigate('/products'); // Redirect to products page if search is empty
        }
        setSearchQuery(''); // Clear search input after submission
        // setIsSearchOpen(false); // Close search bar after submissions
    };

    useEffect(() => {
        if (isSearchOpen) {
            document.querySelector('.search-input')?.focus();
        }
    }, [isSearchOpen]);

    return (
        <nav className="navbar" role="navigation" aria-label="Main navigation">
            <div className="navbar-container">

                {/* Logo */}
                <div className="navbar-logo">
                    <Link to="/" onClick={() => setIsMenuOpen(false)} className="navbar-link">
                        PrimeBrandshop
                    </Link>
                </div>

                {/* Navigation Links */}
                <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
                    <ul>
                        <li onClick={() => setIsMenuOpen(false)}><Link to="/">Home</Link></li>
                        <li><Link to="/products">Products</Link></li>
                        <li><Link to="/about-us">About Us</Link></li>
                        <li><Link to="/contact-us">Contact Us</Link></li>
                    </ul>
                </div>

                {/* Search Bar */}
                <div className="navbar-icons">
                    <div className="search-container">
                        <form
                            className={`search-form ${isSearchOpen ? 'active' : ''}`}
                            onSubmit={handleSearchSubmit}
                            role="search"
                            aria-label="Search products"
                        >
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search products..."
                                value={searchQuery} npm
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button type="submit" className="search-icon" aria-label="Submit search" onClick={toggleSearch}>
                                <SearchIcon focusable="false" />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Cart & Register */}
                <div className="navbar-actions">
                    <div className="cart-container">
                        <Link to="/cart" className="cart-link" aria-label="View cart">
                            <ShoppingCartIcon className="icon" />
                            <span className="cart-badge">{cartCount}</span>
                        </Link>
                    </div>
                    {!isAuthenticated && (
                        <Link to="/register" className="register-link" aria-label="Register">
                            <PersonAddIcon className="icon" />
                        </Link>
                    )}
                    <div className="navbar-hamburger" onClick={toggleMenu}>
                        {isMenuOpen ? (
                            <CloseIcon className="icon" aria-label="Close menu" />
                        ) : (
                            <MenuIcon className="icon" aria-label="Open menu" />
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
