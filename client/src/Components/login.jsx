import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './sup.css'; // Ensure you have the correct path for your CSS file
import Axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  Axios.defaults.withCredentials = true
  const handleSubmit = (e) => {
    e.preventDefault();
    Axios.post("http://localhost:3000/auth/login", {
      email,
      password,
    })
      .then(response => {
        if(response.status === 201){
        navigate('/');
        }
      })
      .catch(err => {
        if (err.response.status ===404) {
          toast.error("Email not found. Please check your email.", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
            });
            
        }
        else if (err.response.status === 401) {
          toast.error("Incorrect password. Please try again.", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
            });
            
        }
      });
  };

  return (
    <>
    <ToastContainer />
    <div className='wrapper'>
      <form onSubmit={handleSubmit}>
        <h1>Log in</h1>
        <div className="input-box">
          <input 
            type="email" 
            placeholder="Email" 
            required
            onChange={(e) => setEmail(e.target.value)} 
          />
        </div>

        <div className="input-box">
          <input 
            type="password" 
            placeholder="Password" 
            required
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>

        <div className="remember-forgot">
          <label>
            <input type="checkbox" /> Remember me
          </label>
          <Link className='linka' to='/forgetPassword'>Forgot password?</Link>
        </div>

        <button type="submit" className="btn">Log In</button>

        <div className="register-link">
          <p>Don't have an account? <Link className='linka' to='/signup'>Sign up</Link></p>
        </div>
      </form>
    </div>
    </>);
}

export default Login;
