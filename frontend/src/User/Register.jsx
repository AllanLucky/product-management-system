import React, { useState } from 'react';
import '../UserStyles/Form.css';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

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
        const { name, email, password } = formData;

        // Basic validation
        if (!name || !email || !password) {
            toast.error("Please fill out all the required fields", {
                position: "top-right",
                autoClose: 3000
            });
            return;
        }

        // Create FormData object
        const myForm = new FormData();
        myForm.set("name", name);
        myForm.set("email", email);
        myForm.set("password", password);

        // Log form values
        for (let [key, value] of myForm.entries()) {
            console.log(`${key}: ${value}`);
        }

        toast.success("Form submitted successfully!", {
            position: "top-right",
            autoClose: 3000
        });

        // Reset form
        setFormData({
            name: '',
            email: '',
            password: '',
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
                        />
                    </div>

                    <div className="input-group">
                        <input
                            type="email"
                            className="input-field"
                            placeholder="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-group">
                        <input
                            type="password"
                            className="input-field"
                            placeholder="Password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange} // ✅ FIXED
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
