import React, { useEffect, useState } from 'react';
import '../AdminStyles/UpdateRole.css';
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSingleUser, removeErrors, removeSuccess, updateUserRole } from '../features/admin/adminSlice';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

function UpdateRole() {
    const { id } = useParams();
    const { user, success, loading, error } = useSelector(state => state.admin);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: ""
    });
    const { name, email, role } = formData;

    // Fetch user once on component mount
    useEffect(() => {
        dispatch(fetchSingleUser(id));
    }, [dispatch, id]);

    // Update formData when user is loaded
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                role: user.role || "",
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateUserRole({ id, role }));
    };

    // Handle success
    useEffect(() => {
        if (success) {
            toast.success(success.message, { position: "top-right", autoClose: 3000 });
            dispatch(removeSuccess());
            navigate('/admin/users'); // Redirect back to all users
        }
    }, [dispatch, success, navigate]);

    // Handle errors
    useEffect(() => {
        if (error) {
            toast.error(error.message, { position: "top-right", autoClose: 3000 });
            dispatch(removeErrors());
        }
    }, [dispatch, error]);

    if (loading) return <Loader />;

    return (
        <>
            <PageTitle title="Update User Role" />
            <Navbar />
            <div className="page-wrapper">
                <div className="update-user-role-container">
                    <h1>Update User Role</h1>
                    <form className='update-user-role-form' onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input type="text" id='name' name='name' value={name} readOnly />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" id='email' name='email' value={email} readOnly />
                        </div>

                        <div className="form-group">
                            <label htmlFor="role">Role</label>
                            <select name="role" id="role" required value={role} onChange={handleChange}>
                                <option value="">Select Role</option>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <button type="submit" className="btn btn-primary">Update Role</button>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default UpdateRole;
