import React, { useState } from 'react';
import '../UserStyles/Form.css';
import { Link } from 'react-router-dom';

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const submissionData = new FormData();
        submissionData.append('name', formData.name);
        submissionData.append('email', formData.email);
        submissionData.append('password', formData.password);


        console.log('Form submitted:', {
            ...formData,
        });
    };

    return (
        <div className="form-container container">
            <div className="form-content">
                <form className="form" onSubmit={handleSubmit}>
                    <h2 className="form-title">Sign Up</h2>

                    <div className="input-group">
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Username"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <input
                            type="password"
                            className="input-field"
                            placeholder="Password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="authBtn">
                        Sign Up
                    </button>
                    <p className="form-links">
                        Already have an account? <Link to="/login">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Register;
