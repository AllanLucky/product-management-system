import React, { useEffect, useState } from 'react'
import '../UserStyles/Form.css'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, removeErrors, removeSuccess } from '../features/user/userSlice';

function Register() {
    const [user, setUser] = useState({ name: "", email: "", password: "" })
    // const [avatar, setAvatar] = useState("");
    // const [avatarPreview, setAvatarPreview] = useState('./images/profile.jpg')
    const [loading, setLoading] = useState(false);
    const [submitAttempted, setSubmitAttempted] = useState(false); // <-- track fresh submit

    const { name, email, password } = user
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { error, success } = useSelector(state => state.user);

    const registerData = (e) => {
        if (e.target.name === "avatar") {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    // setAvatarPreview(reader.result)
                    // setAvatar(reader.result)
                }
            }
            reader.readAsDataURL(e.target.files[0]);
        } else {
            setUser({ ...user, [e.target.name]: e.target.value })
        }
    }

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
        myForm.set('name', name)
        myForm.set('email', email)
        myForm.set('password', password)
        // myForm.set('avatar', avatar)

        setLoading(true);
        setSubmitAttempted(true); // mark that user just submitted
        dispatch(registerUser(myForm))
    }

    useEffect(() => {
        if (error && submitAttempted) {
            toast.error(error, { position: "top-right", autoClose: 3000 });
            dispatch(removeErrors());
            setLoading(false);
            setSubmitAttempted(false); // reset flag
        }
    }, [dispatch, error, submitAttempted]);

    useEffect(() => {
        if (success && submitAttempted) {
            toast.success("Registration Successful", { position: "top-right", autoClose: 3000 });
            dispatch(removeSuccess());
            setLoading(false);
            setSubmitAttempted(false); // reset flag
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
                    <div className="input-group avatar-group">
                        {/* 
                        <input
                            type='file'
                            name='avatar'
                            className='file-input'
                            accept='image/*'
                            onChange={registerData}
                        />
                        <img 
                            src={avatarPreview}
                            alt="avatar Preview"
                            className='avatar' 
                        /> 
                        */}
                    </div>
                    <button className="authBtn"
                        disabled={loading}>
                        {loading ? "Signing up..." : "Sign Up"}
                    </button>
                    <p className="form-links">
                        Already have an account?<Link to="/login">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    )

}

export default Register
