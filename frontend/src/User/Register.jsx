import React, { useEffect, useState } from 'react'
import '../UserStyles/Form.css'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, removeErrors, removeSuccess } from '../features/user/userSlice';

function Register() {
    const [user, setUser] = useState({ name: "", email: "", password: "" })
    const [avatar, setAvatar] = useState("");
    const [avatarPreview, setAvatarPreview] = useState('./images/profile.jpg')
    const { name, email, password } = user
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { error, success } = useSelector(state => state.user);

    const registerData = (e) => {
        if (e.target.name === "avatar") {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatarPreview(reader.result)
                    setAvatar(reader.result)
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
        myForm.set('avatar', avatar)

        for (let pair of myForm.entries())
            console.log(pair[0] + '-' + pair[1]);

        dispatch(registerUser(myForm))
    }

    useEffect(() => {
        if (error) {
            toast.error(error, { position: "top-right", autoClose: 3000 });
            dispatch(removeErrors());
        }
    }, [dispatch, error]);

    useEffect(() => {
        if (success) {
            toast.success("Registration Successful", { position: "top-right", autoClose: 3000 });
            dispatch(removeSuccess());
            navigate("/login");
        }
    }, [dispatch, success, navigate]);

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
                    <div className="input-group atavar-group">
                        <input
                            type='file'
                            name='avatar'
                            className='file-input'
                            accept='image/*'
                            onChange={registerData}
                        />
                        <img src={avatarPreview} alt="avatar Preview" className='avatar' />
                    </div>
                    <button className="authBtn">Sign Up</button>
                    <p className="form-links">
                        Already have an account?<Link to="/login">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Register
