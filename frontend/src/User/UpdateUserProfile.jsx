import React, { useEffect, useState } from 'react';
import '../UserStyles/Form.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeErrors, updateProfile } from '../features/user/userSlice';

function UpdateUserProfile() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState('');
    const [avatarPreview, setAvatarPreview] = useState('./images/profile.jpg');

    const { user, error, success, message, loading } = useSelector(state => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
            setAvatarPreview(user.avatar?.url || './images/profile.jpg');
        }
    }, [user]);

    const ProfileImageUpdate = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please select a valid image file');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setAvatarPreview(reader.result);
                setAvatar(reader.result);
            }
        };
        reader.onerror = () => {
            toast.error('Error reading file');
        };
        reader.readAsDataURL(file);
    };

    const updateSubmit = (e) => {
        e.preventDefault();
        const myForm = new FormData();
        myForm.set('name', name);
        myForm.set('email', email);
        if (avatar) myForm.set('avatar', avatar);
        dispatch(updateProfile(myForm));
    };

    useEffect(() => {
        if (error) {
            toast.error(error.message || 'Something went wrong', { position: 'top-right', autoClose: 3000 });
            dispatch(removeErrors());
        }
    }, [dispatch, error]);

    useEffect(() => {
        if (success) {
            toast.success(message || 'Profile updated successfully', { position: 'top-right', autoClose: 3000 });
            dispatch(removeErrors());
            navigate('/profile');
        }
    }, [dispatch, success, message, navigate]);

    return (
        <>
            <Navbar />
            <div className="container update-container">
                <div className="form-content">
                    <form className="form" encType="multipart/form-data" onSubmit={updateSubmit}>
                        <h2>Update Profile</h2>
                        <div className="input-group avatar-group">
                            <input
                                type="file"
                                accept="image/*"
                                className="file-input"
                                onChange={ProfileImageUpdate}
                                name="avatar"
                            />
                            <img src={avatarPreview} alt="User Profile" className="avatar" />
                        </div>
                        <div className="input-group">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                name="name"
                                placeholder="Enter your name"
                            />
                        </div>
                        <div className="input-group">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                name="email"
                                placeholder="Enter your email"
                            />
                        </div>
                        <button className="authBtn" disabled={loading}>
                            {loading ? 'Updating...' : 'Update'}
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default UpdateUserProfile;
