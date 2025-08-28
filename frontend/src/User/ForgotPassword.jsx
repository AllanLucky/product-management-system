import React, { useEffect, useState } from 'react';
import '../UserStyles/Form.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTitle from '../components/PageTitle';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeErrors, forgotPassword } from '../features/user/userSlice';
import { toast } from 'react-toastify';

function ForgotPassword() {
    const { success, loading, error, message } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');

    const forgotPasswordSubmit = (e) => {
        e.preventDefault();
        const myForm = new FormData();
        myForm.set('email', email);

        dispatch(forgotPassword(myForm));
        setEmail("");
    };

    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'top-right', autoClose: 3000 });
            dispatch(removeErrors());
        }
    }, [dispatch, error]);

    useEffect(() => {
        if (success) {
            toast.success(
                message || 'Reset link sent to your email',
                { position: 'top-right', autoClose: 3000 }
            );
            dispatch(removeErrors());
            // navigate('/login'); // redirect user back to login after success
        }
    }, [dispatch, success, message, navigate]);

    return (
        <>
            <Navbar />
            <PageTitle title="Forgot Password" />
            <div className="container form-container">
                <div className="form-content email-group">
                    <form className="form" onSubmit={forgotPasswordSubmit}>
                        <h2>Forgot Password</h2>
                        <div className="input-group">
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your registered email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button className="authBtn" type="submit" disabled={loading}>
                            {loading ? 'Sending...' : 'Send'}
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default ForgotPassword;
