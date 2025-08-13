import React, { useEffect, useState } from 'react';
import '../UserStyles/Form.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTitle from '../components/PageTitle';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeErrors, updatePassword } from '../features/user/userSlice';
import { toast } from 'react-toastify';

function UpdatePassword() {
    const { success, loading, error, message } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const updatePasswordSubmit = (e) => {
        e.preventDefault();
        const myForm = new FormData();
        myForm.set('oldPassword', oldPassword);
        myForm.set('newPassword', newPassword);
        myForm.set('confirmPassword', confirmPassword);

        dispatch(updatePassword(myForm));
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
                message || 'Password updated successfully',
                { position: 'top-right', autoClose: 3000 }
            );
            dispatch(removeErrors());
            navigate('/profile');
        }
    }, [dispatch, success, message, navigate]);

    return (
        <>
            <Navbar />
            <PageTitle title="Password Update" />
            <div className="container update-container">
                <div className="form-content">
                    <form className="form" onSubmit={updatePasswordSubmit}>
                        <h2>Update Password</h2>
                        <div className="input-group">
                            <input
                                type="password"
                                name="oldPassword"
                                placeholder="Old Password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <input
                                type="password"
                                name="newPassword"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button className="authBtn" type="submit" disabled={loading}>
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default UpdatePassword;
