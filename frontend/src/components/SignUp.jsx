import React from "react";

const SignUp = () => {
  return (
    <div className="Signuppage">
      <form action="">
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
            />
          </div>
          <button className="registerbtn" type="submit">Register</button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
