import React from "react";

const Login = () => {
  return (
    <div className="loginpage">
      <form action="">
        <h2 className="loginpage-heading" >Login</h2>
        <div className="logininputs">
          <div className="logininput">
            <label htmlFor="username">Username</label>
            <input type="name" id="username" name="username" placeholder="username" required />
          </div>
          <div className="logininput">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" placeholder="password" required />
          </div>
          <button className="loginbtn" type="submit">Login</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
