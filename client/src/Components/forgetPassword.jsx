import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './sup.css'; // Ensure you have the correct path for your CSS file
import Axios from 'axios';

function forgetPassword() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    Axios.post("http://localhost:3000/auth/forgot-password", {
      email,
    })
      .then(response => {
        if(response.data.status){
            toast.success('check your email for reset link', {
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
              setTimeout(() => {
                navigate('/login');
              }, 2000); // Delay for 2 seconds
            
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  
    return (
      <>
      <ToastContainer />
      <div className='wrapper'>
        <form onSubmit={handleSubmit}>
          <h1>Forgot Password</h1>

          <p className='par'>Enter your email and we'll send you a link to reset your password.</p>

          <div className="input-box">
            <input 
              type="email" 
              placeholder="Email" 
              required
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
  
          <button type="submit" className="btn">Submit</button>
        </form>
      </div>
      </>);
}

export default forgetPassword