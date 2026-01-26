import React from "react";
import { useAuth } from "../context/AuthContext";
import front_page_photo from "../assets/front_page_photo.png";
const Home = () => {
  const { user, loading } = useAuth();
  if (!loading && user) {
    window.location.href = "/feed";
  }
  console.log("User in Home component:", user?.user?.username);
  console.log("Loading state in Home component:", loading);
  return (
    <>
      <div className="homepageImg">
        <div className="front_page_Image">
          <img src={front_page_photo} alt="" />
        </div>
      </div>
      <div className="siteName">
        <h1 id="siteName">S+ve | Social positive</h1>
      </div>
      <div className="fpquote">
        Being yourself is your biggest social strength.
      </div>
      <div className="authButtons">
        <a href="/signup" className="btnauth">
          Sign Up
        </a>
        <a href="/login" className="btnauth">
          Login
        </a>
      </div>
    </>
  );
};

export default Home;
