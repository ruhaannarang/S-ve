import React, { useState ,useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  let Navigate = useNavigate();


  useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    fetch("http://localhost:3000/api/auth/getuser", {
      method: "GET",
      headers: {
        "auth-token": localStorage.getItem("authtoken"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("User data:", data);
        // Handle successful user fetch
      })
      .catch((error) => {
        console.error("Failed to fetch user:", error);
        // Handle user fetch failure
      });
  } else {
    Navigate("/login");
  }
}, []);



  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("authtoken"),
      },
      body: JSON.stringify(credentials),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Login successful:", data);
        const token = data.authtoken;
        console.log(token);
        localStorage.setItem("token", token);
        // Handle successful login (e.g., redirect, store token)
      })
      .catch((error) => {
        console.error("Login failed:", error);
        // Handle login failure
      });
  };
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="loginpage">
      <form action="" onSubmit={handleSubmit}>
        <h2 className="loginpage-heading">Login</h2>
        <div className="logininputs">
          <div className="logininput">
            <label htmlFor="username">Username</label>
            <input
              type="name"
              id="username"
              name="username"
              placeholder="username"
              required
              onChange={onChange}
            />
          </div>
          <div className="logininput">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="password"
              required
              onChange={onChange}
            />
          </div>
          <button className="loginbtn" type="submit">
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
