import React,{useState} from "react";
import {useNavigate} from "react-router-dom";
const SignUp = () => {
  const[credentials,setCredentials]=useState({username:"",email:"",password:""})
  let Navigate=useNavigate();

  const handleSubmit=async(e)=>{
    e.preventDefault();
    const response = await fetch('http://localhost:3000/api/auth/createuser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });
    const json = await response.json();
    if(json.success){
      localStorage.setItem('token',json.authtoken);
      Navigate('/home');
    }
  }
  const onChange=(e)=>{
    setCredentials({...credentials,[e.target.name]:e.target.value})
  }

  return (
    <div className="Signuppage">
      <form onSubmit={handleSubmit} action="">
        <h2 className="signup-page-heading">Sign Up</h2>
        <div className="inputs">
          <div className="input">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="username"
              name="username"
              required
              onChange={onChange}
            />
          </div>
          <div className="input">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="email"
              name="email"
              required
              onChange={onChange}
            />
          </div>
          <div className="input">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="password"
              name="password"
              required
              onChange={onChange}
            />
          </div>
          <button className="registerbtn" type="submit">Register</button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
