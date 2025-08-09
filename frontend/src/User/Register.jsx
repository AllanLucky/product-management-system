import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import '../UserStyles/Form.css';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerUser, removeErrors, removeSuccess } from '../features/user/userSlice';

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const { success, loading, error } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

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
            toast.error("Please fill out all required fields", {
                position: "top-right",
                autoClose: 3000
            });
            return;
        }

        dispatch(registerUser(formData));
    };

    useEffect(() => {
        if (error) {
            toast.error(error, { position: "top-right", autoClose: 3000 });
            dispatch(removeErrors());
        }

        if (success) {
            toast.success("Registration successful!", {
                position: "top-right",
                autoClose: 3000
            });
            setFormData({ name: '', email: '', password: '' });
            dispatch(removeSuccess());
            navigate('/login');
        }
    }, [error, success, dispatch, navigate]);

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
                            disabled={loading}
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
                            disabled={loading}
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
                            disabled={loading}
                        />
                    </div>

                    <button type="submit" className="authBtn" disabled={loading}>
                        {loading ? "Signing Up..." : "Sign Up"}
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
