import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  let Navigate = useNavigate();
  console.log("TOKEN:", localStorage.getItem("token"));

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:3000/api/auth/getuser", {
        method: "GET",
        headers: {
          // use the same storage key where we save the token ("token")
          "auth-token": localStorage.getItem("token"),
        },
       
      })
        .then((response) => response.json())
        .then((data) => {
          // guard the response shape before accessing properties
          if (data && data.success && data.user) {
            console.log("User data:", data.user);
            console.log(data.user.username)
            Navigate("/home");
          } else {
            console.error("No user returned from getuser:", data);
            localStorage.removeItem("token");
            Navigate("/login");
          }
        })
        .catch((error) => {
          console.error("Failed to fetch user:", error);
         
        });
    } else {
      Navigate("/login");
    }
  }, [Navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Login response:", data);
        if (data && data.authtoken) {
          const token = data.authtoken;
          localStorage.setItem("token", token);
          Navigate("/home");
        } else {
          console.error("Login failed or no token returned:", data);
          Navigate("/login");
        }
      })
      .catch((error) => {
        console.error("Login failed:", error);
        Navigate("/login");
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
