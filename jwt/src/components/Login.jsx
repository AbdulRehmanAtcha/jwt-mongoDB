import React from 'react'
import './login.css';
import drop from '../icons/blood-drop.png'
import { NavLink } from 'react-router-dom';
import { useState, useContext } from "react";
import { GlobalContext } from '../context/Context';
import axios from 'axios';

const baseUrl = "http://localhost:5001/api/v1";


const Login = () => {





  let { state, dispatch } = useContext(GlobalContext);  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailHandler = (e) => {
    setEmail(e.target.value);
  }
  const passHandler = (e) => {
    setPassword(e.target.value);
  }
  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      let response = await axios.post(`${baseUrl}/login`, {
        email: email,
        password: password
      }, {
        withCredentials: true
      })
      dispatch({
        type: "USER_LOGIN",
        payload: null
    })
      console.log("Login Successful", email);
      alert("Login Successful");
    }
    catch (e) {
      console.log("Error", e);
    }
  }
  return (
    <body>
      <div className="login">
        <img src={drop} alt="Drop" />
        <h2>LOG IN</h2>
        <form onSubmit={loginHandler}>
          <input type="email" placeholder='Email' name="email" onChange={emailHandler} autoComplete="on" />
          <input type="password" placeholder='Password' onChange={passHandler} />
          <button type='submit'>Login</button>
        </form>
        <h3>Don't Have An Account? <span><NavLink to="/signup">Click Here</NavLink></span></h3>
      </div>
    </body>
  )
}

export default Login;
