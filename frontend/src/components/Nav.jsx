import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
const Nav = () => {
  let Navigate = useNavigate();
  const { user, loading } = useAuth();
  if (!user) {
    return <div>Loading... . If you are not redirected automatically, please refresh the page.</div>;
  }
  console.log(loading);
  const username = user?.user?.username;
  const email = user?.user?.email;
  return (
    <div>
      <div className="siteNamefeedpage">
        S+ve | Social positive
        <div className="navoptions">
          <p onClick={() => Navigate("/feed")}>Feed</p>
          <p onClick={() => Navigate("/message")}>Chat in Public</p>
          <p onClick={() => Navigate("/chat")}>Chat with S+ AI</p>
        </div>
        </div>

      <div className="nav">
        <p>👤{username}</p>
        <p>✉️ {email}</p>
      </div>
      <div className="line"></div>
    </div>
  );
};

export default Nav;
