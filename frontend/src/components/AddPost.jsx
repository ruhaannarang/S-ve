import React, { useState } from "react";
import Nav from "./Nav";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
const AddPost = () => {
  const { user, loading } = useAuth();
  console.log(loading);
  const userrname = user?.user?.username;
  const [loadingg, setLoadingg] = useState(false);
  const [credentials, setCredentials] = useState({
    username: { userrname },
    caption: "",
    image: null,
  });
  
  let Navigate = useNavigate();
  //   const email = user?.user?.email;
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  const onChangeImg = async (e) => {
    const file = e.target.files[0];
    setLoadingg(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "s+ve_posts");
    data.append("cloud_name", "danmv4rdq");
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/danmv4rdq/image/upload",
      {
        method: "post",
        body: data,
      },
    );
    const imgUrl = await res.json();
    setLoadingg(false);
    console.log(imgUrl);
    setCredentials({ ...credentials, image: imgUrl.secure_url });
  };
  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log(credentials);
    const res = await fetch("http://localhost:3000/addpost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: user?.user?.username, // ✅ string only
        caption: credentials.caption,
        image: credentials.image,
      }),
    });
    console.log(res);
    await Navigate("/feed");
  };
  return (
    <div>
      <Nav />
      <div className="addpostpage">
        <form action="" onSubmit={handleSubmit}>
          <div className="addpostinputs">
            <div className="inputs">
              <div className="input">
                <label htmlFor="username">Username</label>
                <input
                  type="name"
                  value={userrname || ""}
                  id="myusername"
                  name="username"
                  placeholder="username"
                  readOnly
                />
              </div>
              <div className="input">
                <label htmlFor="caption">Caption</label>
                <input
                  type="text"
                  id="caption"
                  name="caption"
                  placeholder="caption"
                  required
                  onChange={onChange}
                />
              </div>
              <div className="input">
                <input
                  type="file"
                  id="image"
                  name="image"
                  required
                  onChange={onChangeImg}
                />
                {loadingg ? <p>Uploading image...</p> : null}
              </div>
            </div>
            <button className="addpost" type="submit">
              Add Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPost;
