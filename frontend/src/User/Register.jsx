import React, { useEffect, useState } from 'react';
import '../UserStyles/Form.css';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, removeErrors, removeSuccess } from '../features/user/userSlice';

function Register() {
    const [user, setUser] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [submitAttempted, setSubmitAttempted] = useState(false);

    const { name, email, password } = user;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { error, success } = useSelector(state => state.user);

    // ✅ Reset form on component mount
    useEffect(() => {
        setUser({ name: "", email: "", password: "" });
    }, []);

    const registerData = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const registerSubmit = (e) => {
        e.preventDefault();

        if (!name || !password || !email) {
            toast.error('Please fill all the required fields', {
                position: "top-right",
                autoClose: 3000
            });
            return;
        }

        const myForm = new FormData();
        myForm.set('name', name);
        myForm.set('email', email);
        myForm.set('password', password);

        setLoading(true);
        setSubmitAttempted(true);
        dispatch(registerUser(myForm));
    };

    // ✅ Handle errors
    useEffect(() => {
        if (error && submitAttempted) {
            toast.error(error, { position: "top-right", autoClose: 3000 });
            dispatch(removeErrors());
            setLoading(false);
            setSubmitAttempted(false);
        }
    }, [dispatch, error, submitAttempted]);

    // ✅ Handle success
    useEffect(() => {
        if (success && submitAttempted) {
            toast.success("Registration Successful", { position: "top-right", autoClose: 3000 });
            dispatch(removeSuccess());

            // ✅ Reset form before redirect
            setUser({ name: "", email: "", password: "" });
            setLoading(false);
            setSubmitAttempted(false);
            navigate("/login");
        }
    }, [dispatch, success, navigate, submitAttempted]);

    return (
        <div className='form-container container'>
            <div className="form-content">
                <form className="form" onSubmit={registerSubmit}>
                    <h2>Register</h2>
                    <div className="input-group">
                        <input
                            type='text'
                            placeholder='Username'
                            name='name'
                            value={name}
                            onChange={registerData}
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type='email'
                            placeholder='Email'
                            name='email'
                            value={email}
                            onChange={registerData}
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type='password'
                            placeholder='Password'
                            name='password'
                            value={password}
                            onChange={registerData}
                        />
                    </div>

                    <button className="authBtn" disabled={loading}>
                        {loading ? "Signing up..." : "Sign Up"}
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
