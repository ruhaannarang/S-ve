import React from "react";
import { useAuth } from "../context/AuthContext";
const Nav = () => {
  const { user, loading } = useAuth();
  if (!user) {
    return <div>Loading...</div>;
  }
  console.log(loading);
  const username = user?.user?.username;
  const email = user?.user?.email;
  return (
    <div>
      <div className="siteNamefeedpage">S+ve | Social positive</div>

      <div className="nav">
        <p>👤{username}</p>
        <p>✉️ {email}</p>
      </div>
      <div className="line"></div>
    </div>
  );
};

export default Nav;
