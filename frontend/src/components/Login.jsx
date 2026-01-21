import React from 'react'

const Login = () => {
  return (
    <div>
      <form action="">
        <h2>Login</h2>
        
        <input type="email" id="email" name="email" required />
        <input type="password" id="password" name="password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default Login
