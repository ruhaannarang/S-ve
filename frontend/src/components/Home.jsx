import React from 'react'
import front_page_photo from "../assets/front_page_photo.png";
const Home = () => {
  return (
    
      <body>
      <div className="front_page_Image">
        <img src= {front_page_photo} alt="" />
      </div>
      <div className="siteName">
        <h1 id='siteName'>S+ve | Social positive</h1>
      </div>
      <div className='fpquote'>Being yourself is your biggest social strength.</div>
      <div className="authButtons">
        <a href="/signup" className="btnauth">Sign Up</a>
        <a href="/login" className="btnauth">Login</a>
      </div>
     </body>
    
  )
}

export default Home
