import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../UserStyles/Form.css';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginUser, removeErrors } from '../features/user/userSlice';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const { loading, error, isAuthenticated } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { email, password } = formData;

        if (!email || !password) {
            toast.error("Please fill out all fields", {
                position: "top-right",
                autoClose: 3000
            });
            return;
        }
        dispatch(loginUser(formData));
    };

    useEffect(() => {
        if (error) {
            toast.error(error, { position: "top-right", autoClose: 3000 });
            dispatch(removeErrors());
        }
        if (isAuthenticated) {
            toast.success("Login successful!", {
                position: "top-right",
                autoClose: 3000
            });

            // Clear form after login
            setFormData({ email: '', password: '' });
            navigate('/');
        }
    }, [error, isAuthenticated, dispatch, navigate]);

    return (
        <div className='form-container container'>
            <div className='form-content'>
                <form className='form' onSubmit={handleSubmit} encType="application/x-www-form-urlencoded">
                    <h2 className="form-title">Login</h2>
                    <div className='input-group'>
                        <input
                            type='email'
                            name='email'
                            placeholder='Email'
                            value={formData.email}
                            onChange={handleChange}
                            disabled={loading}
                            autoFocus
                        />
                    </div>
                    <div className='input-group'>
                        <input
                            type='password'
                            name='password'
                            placeholder='Password'
                            value={formData.password}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </div>
                    <button type='submit' className='authBtn' disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                    <p className="form-links">
                        Forgot your password? <Link to="/password/forgot">Reset Here</Link>
                    </p>
                    <p className="form-links">
                        You don’t have an account? <Link to="/register">Register</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;
