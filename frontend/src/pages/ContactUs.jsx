// src/pages/ContactUs.jsx
import React from "react";
import "../pageStyles/ContactUs.css";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function ContactUs() {
    return (

        <>
            <PageTitle title="Contact Us" />
            <Navbar />
            <div className="contact-container">
                {/* Hero Section */}
                <div className="contact-hero">
                    <h1>Contact Us</h1>
                    <p>We’d love to hear from you! Reach out with any questions or feedback.</p>
                </div>

                {/* Contact Info + Form */}
                <div className="contact-content">
                    {/* Left Side - Info */}
                    <div className="contact-info">
                        <h2>Get in Touch</h2>
                        <p>Email: support@primebrandshop.com</p>
                        <p>Phone: +254 700 123 456</p>
                        <p>Location: Nairobi, Kenya</p>
                    </div>

                    {/* Right Side - Form */}
                    <form className="contact-form">
                        <h2>Send a Message</h2>
                        <input type="text" placeholder="Your Name" required />
                        <input type="email" placeholder="Your Email" required />
                        <textarea placeholder="Your Message" rows="5" required></textarea>
                        <button type="submit">Send</button>
                    </form>
                </div>

                {/* Google Maps Section */}
                <div className="contact-map">
                    <h2>Find Us Here</h2>
                    <iframe
                        title="PrimeBrandShop Location"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8578374585344!2d36.821946314753!3d-1.292065999065726!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10e6e4c2d8e3%3A0x53aef73e8ad39b53!2sNairobi%20CBD!5e0!3m2!1sen!2ske!4v1695111229999!5m2!1sen!2ske"
                        width="100%"
                        height="350"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                    ></iframe>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default ContactUs;
