import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import './sup.css';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddTodoList() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();
  Axios.defaults.withCredentials = true
  const handleSubmit = (e) => {
    e.preventDefault();
    
    Axios.post("http://localhost:3000/auth/todolists", {
      name,
      description,
    })
      .then(response => {
        if (response.status === 201) {
          toast.success('List Added', {
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
          console.log(response.data.message)
          navigate('/list');
          setName(''); // Clear input fields after successful submission
          setDescription('');
        }
      })
      .catch(err => {
        if (err.response && err.response.status === 400) {
          toast.error("Error adding list. Please try again.", {
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
        } else {
          toast.error("Failed to add list. Server error occurred.", {
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
          <h1>Add New To-Do List</h1>
          <div className="input-box">
            <input 
              type="text" 
              placeholder="Title" 
              value={name}
              onChange={(e) => setName(e.target.value)} 
              required
            />
          </div>

          <div className="input-box">
            <input 
              type="text" 
              placeholder="Description" 
              value={description}
              onChange={(e) => setDescription(e.target.value)} 
              required
            />
          </div>

          <button type="submit" className="btn">Add To-Do List</button>

          <div className="register-link">
            <p>Go back to <Link className='linka' to='/todo'>To-Do Lists</Link></p>
          </div>
        </form>
      </div>
    </>
  );
}

export default AddTodoList;
