import React from 'react';
import './Signup.css';
import drop from '../icons/blood-drop.png';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';


const Signup = () => {
    let baseURL = "";
    if (window.location.href.split(":")[0] === "http") {
      baseURL = `http://localhost:5001`;
    }
    else {
      baseURL = `https://spring-bud-pike-coat.cyclic.app` || `https://spring-bud-pike-coat.cyclic.app/signup`;
    }
    const [fName, setFName] = useState("");
    const [lName, setLName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const fNameHandler = (e)=>{
        setFName(e.target.value);
    }
    const lNameHandler = (e)=>{
        setLName(e.target.value);
    }
    const emailHandler = (e)=>{
        setEmail(e.target.value);
    }
    const passHandler = (e)=>{
        setPassword(e.target.value);
    }
    const signupHandler = async(e)=>{
        e.preventDefault();
        try{
            let response = await axios.post(`${baseURL}/signup`,{
                firstName: fName,
                lastName: lName,
                email: email,
                password: password
            },{
                withCredentials: true
            })
            console.log("Signup Successful");
            alert("Signup Successful")
        }
        catch(e){
            console.log("Error", e);
        }
    }

    return (
        <>
            <body>
                <div className="signup">
                    <img src={drop} alt="Drop" />
                    <h2>Sign Up</h2>
                    <form onSubmit={signupHandler}>
                        <input type="text" placeholder='First Name' name="firstName" onChange={fNameHandler} />
                        <input type="text" placeholder='Last Name' name="lastName" onChange={lNameHandler} />
                        <input type="email" placeholder='Email' name="email" onChange={emailHandler}/>
                        <input type="password" placeholder='Password' onChange={passHandler}/>
                        <button type='submit'>Create Account</button>
                    </form>
                    <h3>Already Have An Account? <span><NavLink to="/">Click Here</NavLink></span></h3>
                </div>
            </body>
        </>
    )
}

export default Signup
