import React, { useState } from 'react';
import { useNavigate , useParams } from 'react-router-dom';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import './sup.css'; // Ensure you have the correct path for your CSS file
import Axios from 'axios';

function resetPassword() {

  const [password, setPassword] = useState('');
  const {token} =useParams();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    Axios.post("http://localhost:3000/auth/reset-password/"+token, {
      password,
    })
      .then(response => {
        if(response.status === 200){
          toast.success('Password changed successfully', {
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
            }, 2000);
        }
        console.log(response.data)
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
          <h1>Reset Password</h1>

          <p className='par'>Enter new Password.</p>

          <div className="input-box">
          <input 
            type="password" 
            placeholder="New Password" 
            required
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>
  
          <button type="submit" className="btn">Reset Password</button>
        </form>
      </div>
    </>
    );
}

export default resetPassword