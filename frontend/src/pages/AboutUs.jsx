import React from "react";
import "../pageStyles/AboutUs.css"
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import Footer from "../components/Footer";
function AboutUs() {
    return (
        <>
            <Navbar />
            <PageTitle title="AboutUs" />

            <div className="about-container">
                {/* Hero Section */}
                <div className="about-hero">
                    <h1>About PrimeBrandShop</h1>
                    <p>
                        PrimeBrandShop is your trusted destination for premium quality products.
                    </p>
                </div>

                {/* Mission Section */}
                <div className="about-mission">
                    <h2>Our Mission</h2>
                    <p>
                        To deliver top-notch products with unbeatable quality and reliability,
                        ensuring that every customer enjoys the best shopping experience.
                    </p>
                </div>

                {/* Values Section */}
                <div className="about-values">
                    <div className="value-card">
                        <h3>Quality First</h3>
                        <p>We carefully select products that meet high standards of durability and excellence.</p>
                    </div>
                    <div className="value-card">
                        <h3>Customer Focus</h3>
                        <p>Your satisfaction is our top priority. We’re here to serve you better every day.</p>
                    </div>
                    <div className="value-card">
                        <h3>Innovation</h3>
                        <p>We embrace new trends and technologies to bring you the latest and best products.</p>
                    </div>
                </div>

                {/* Team Section */}
                <div className="about-team">
                    <h2>Meet Our Team</h2>
                    <div className="team-members">
                        <div className="team-member">
                            <img src="/images/profile.jpg" alt="Jane" />
                            <h3>Allan Lucky</h3>
                            <p>CEO</p>
                        </div>
                        <div className="team-member">
                            <img src="./images/kenda.jpg" alt="Kenda" />
                            <h3>Kenda Abdullar</h3>
                            <p>Products Manager</p>
                        </div>
                        <div className="team-member">
                            <img src="./images/rama.jpg" alt="Ramadhan" />
                            <h3>Ramadhan Karisa</h3>
                            <p>Technical Support</p>
                        </div>
                        <div className="team-member">
                            <img src="./images/tina.jpg" alt="Tina" />
                            <h3>Tina Jackson</h3>
                            <p>Team Support</p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}

export default AboutUs;
