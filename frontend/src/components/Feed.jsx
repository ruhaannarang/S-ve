import React from "react";
import Nav from "./Nav";
const Feed = () => {
  return (
    <div>
      <div className="navbox">
        <Nav />
      </div>
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
            <div className="postinfo">
              <h3>Username</h3>
              <p>This is a sample post content. Hello world!</p>
            </div>
          </div>

          <div className="post">
            <div className="image">
              <img
                src="https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVvcGxlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
                alt=""
              />
            </div>
            <div className="postinfo">
              <h3>Username</h3>
              <p>This is a sample post content. Hello world!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
