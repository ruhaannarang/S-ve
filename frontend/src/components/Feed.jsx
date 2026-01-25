import React from "react";
import Nav from "./Nav";
import { Navigate } from "react-router-dom";
const Feed = () => {
    const addpost = () => {
        Navigate("/addpost");
    };
  return (
    <div>
      
        <Nav />
      
      <div className="feedpage">Feed Page</div>
      <div className="feedsec">
        <div className="feed">
            
          <div className="post">
            <div className="image">
              <img
                src="https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVvcGxlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
                alt=""
              />
            </div>
             <div className="postopts">
              <div className="postinfo">
                <h3>Username</h3>
                <p>This is a sample post content. Hello world!</p>
              </div>
              <div className="like">🤍</div>
            </div>
          </div>

          <div className="post">
            <div className="image">
              <img
                src="https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVvcGxlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
                alt=""
              />
            </div>
             <div className="postopts">
              <div className="postinfo">
                <h3>Username</h3>
                <p>This is a sample post content. Hello world  Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi fugiat, quidem, voluptates iure, id aliquid temporibus molestias rerum consequatur modi vitae illo.!</p>
              </div>
              <div className="like">🤍</div>
            </div>
          </div>

        </div>

      </div>
      <div className="addpostbtn" onClick={addpost}>
        Add Post
      </div>
    </div>
  );
};

export default Feed;
