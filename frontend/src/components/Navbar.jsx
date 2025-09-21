import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../componentStyles/Navbar.css";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import "../pageStyles/Search.css";
import { useSelector } from "react-redux";

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // ✅ Get user state
    const { isAuthenticated } = useSelector((state) => state.user);

    // ✅ Get cart items from Redux
    const { cartItems } = useSelector((state) => state.cart);

    // ✅ OPTION 1: Count total quantities (default)
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    // ✅ OPTION 2: Count unique items only
    // const cartCount = cartItems.length;

    const navigate = useNavigate();

    // Toggle menu open/close
    const toggleMenu = () => setIsMenuOpen((prev) => !prev);

    // Toggle search bar open/close
    const toggleSearch = () => setIsSearchOpen((prev) => !prev);

    // Handle search form submit
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const trimmedQuery = searchQuery.trim();
        if (trimmedQuery) {
            navigate(`/products?keyword=${encodeURIComponent(trimmedQuery)}`);
        } else {
            navigate("/products");
        }
        setSearchQuery("");
    };

    // Auto-focus on search input when opened
    useEffect(() => {
        if (isSearchOpen) {
            document.querySelector(".search-input")?.focus();
        }
    }, [isSearchOpen]);

    return (
        <nav className="navbar" role="navigation" aria-label="Main navigation">
            <div className="navbar-container">
                {/* Logo */}
                <div className="navbar-logo">
                    <Link
                        to="/"
                        onClick={() => setIsMenuOpen(false)}
                        className="navbar-link"
                    >
                        PrimeBrandshop
                    </Link>
                </div>

                {/* Navigation Links */}
                <div className={`navbar-links ${isMenuOpen ? "active" : ""}`}>
                    <ul>
                        <li onClick={() => setIsMenuOpen(false)}>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/products">Products</Link>
                        </li>
                        <li>
                            <Link to="/about-us">About Us</Link>
                        </li>
                        <li>
                            <Link to="/contact-us">Contact Us</Link>
                        </li>
                    </ul>
                </div>

                {/* Search Bar */}
                <div className="navbar-icons">
                    <div className="search-container">
                        <form
                            className={`search-form ${isSearchOpen ? "active" : ""}`}
                            onSubmit={handleSearchSubmit}
                            role="search"
                            aria-label="Search products"
                        >
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button
                                type="ssubmit"
                                className="search-icon"
                                aria-label="Toggle search"
                                onClick={toggleSearch}
                            >
                                <SearchIcon />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Cart, Register, Menu Toggle */}
                <div className="navbar-actions">
                    <div className="cart-container">
                        <Link to="/cart" className="cart-link" aria-label="View cart">
                            <ShoppingCartIcon className="icon" />
                            {cartCount > 0 && (
                                <span className="cart-badge">{cartCount}</span>
                            )}
                        </Link>
                    </div>

                    {!isAuthenticated && (
                        <Link
                            to="/register"
                            className="register-link"
                            aria-label="Register"
                        >
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
