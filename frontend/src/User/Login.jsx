import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../UserStyles/Form.css';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // ✅ added useLocation
import { toast } from 'react-toastify';
import { loginUser, removeErrors } from '../features/user/userSlice';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loginAttempted, setLoginAttempted] = useState(false); 
    const { loading, error, isAuthenticated } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation(); // ✅ use React Router's location
    const redirectParam = new URLSearchParams(location.search).get("redirect") || "/"; // ✅ safe redirect

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
        setLoginAttempted(true); 
        dispatch(loginUser(formData));
    };

    useEffect(() => {
        if (error) {
            toast.error(error, { position: "top-right", autoClose: 3000 });
            dispatch(removeErrors());
            setLoginAttempted(false); 
        }

        if (isAuthenticated && loginAttempted) {
            toast.success("Login successful!", {
                position: "top-right",
                autoClose: 3000
            });

            setFormData({ email: '', password: '' });
            navigate(redirectParam); // ✅ fixed redirect
            setLoginAttempted(false); 
        }
    }, [error, isAuthenticated, loginAttempted, dispatch, navigate, redirectParam]);

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
