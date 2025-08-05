import React from 'react';
import { Phone, Email, GitHub, LinkedIn, Facebook, Instagram } from '@mui/icons-material';


import '../componentStyles/Footer.css';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Section 1: Contact */}
                <div className="footer-section contact">
                    <h3>Contact Us</h3>
                    <p><Phone fontSize='small' /> Phone: +254792491368</p>
                    <p><Email fontSize='small' /> Email: luckytsori8@gmail.com</p>
                </div>

                {/* Section 2: Social Links */}
                <div className="footer-section social">
                    <h3>Follow Me</h3>
                    <div className="social-links">
                        <a href="https://github.com/allanlucky" target="_blank" rel="noopener noreferrer">
                            <GitHub className='social-icon' />
                        </a>
                        <a href="https://www.linkedin.com/in/allan-lucky" target="_blank" rel="noopener noreferrer">
                            <LinkedIn className='social-icon' />
                        </a>
                        <a href="https://web.facebook.com/luckynonda.nonda" target="_blank" rel="noopener noreferrer">
                            <Facebook className='social-icon' />
                        </a>
                        <a href="https://www.instagram.com/tsorilucky/" target="_blank" rel="noopener noreferrer">
                            <Instagram className='social-icon' />
                        </a>
                        {/* <a href="https://wa.me/254792491368" target="_blank" rel="noopener noreferrer">
                            <FaWhatsapp />
                        </a> */}
                    </div>
                </div>

                {/* Section 3: About */}
                <div className="footer-section about">
                    <h3>About</h3>
                    <p>
                        PrimeBrandShop is your trusted destination for premium quality products.
                    </p>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2025 AllanLucky. All rights reserved</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
