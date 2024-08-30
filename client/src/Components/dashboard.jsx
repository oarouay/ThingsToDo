import React, {useEffect} from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const dashboard = () => {
  const navigate = useNavigate()
  axios.defaults.withCredentials=true;
  useEffect(() => {
  axios.get('http://localhost:3000/auth/verify')
    .then(res=> {
    if(res.data.status) {

    } else {
    navigate('/')

    }
    console.log(res)
    })
    },[])
  return (
    <div>dashboard</div>
  )
}

export default dashboard