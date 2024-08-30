import React, { useEffect, useState } from 'react';
import '../App.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Clock from './clock';

function Home() {
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  useEffect(() => {
    // Check if the user is logged in by verifying the token
    axios.get("http://localhost:3000/auth/verify", { withCredentials: true })
      .then(res => {
        if (res.data.status) {
          setUsername(res.data.user.username); // Set the username from the response
        } else {
          setUsername(null); // Clear username if not authenticated
        }
      })
      .catch(err => {
        console.log(err);
        setUsername(null);
      });
  }, []);

  const handleLogout = () => {
    axios.get("http://localhost:3000/auth/logout")
      .then(res => {
        if (res.data.status) {
          localStorage.removeItem('token'); // Remove the token on logout
          setUsername(null);
          navigate('/login');
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <div>
      <Clock />
      <div className='bitino'>
        {username ? (
          <>
            <p className='nameuser'>Hello, {username}!</p>
            <Link to="/list" className='linko'>View Today's To-Do List</Link>
          </>
        ) : (
          <>
            <Link to="/login" className='linko'>Login</Link>
          </>
        )}
      </div>
      {username && (
        <>
          <button className='btn' onClick={handleLogout}>Log out</button>
        </>
      )}
    </div>
  );
}

export default Home;
