import React, { useState } from 'react';
import './sup.css';
import Axios from 'axios';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    Axios.post("http://localhost:3000/auth/signup", {
      username,
      email,
      password,
    })
      .then(response => {
        if(response.status === 201){
          navigate('/login');
        }
      })
      .catch(err => {
        if (err.response.status ===400) {
          toast.error("User already exists.", {
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
        console.log(err);
      });
  };

  return (
    <>
    <ToastContainer />
    <div className='wrapper'>
      <form onSubmit={handleSubmit}>
        <h1>Sign Up</h1>
        <div className="input-box">
          <input 
            type="text" 
            placeholder="Username" 
            required
            onChange={(e) => setUsername(e.target.value)} 
          />
        </div>

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
        </div>

        <button type="submit" className="btn">Sign Up</button>

        <div className="register-link">
          <p>Already have an account? <Link className='linka' to='/login'>Log in</Link></p>
        </div>
      </form>
    </div>
    </>);
};

export default Signup;
