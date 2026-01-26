import React,{useEffect,useState} from "react";
import Nav from "./Nav";
import { useNavigate } from "react-router-dom";
const Feed = () => {
    const [posts, setPosts] = useState([]); 
    let Navigate = useNavigate();
    const addpost = () => {
      Navigate("/addpost");
    };
    const handleLike = (e) => {
      const likeBtn = e.target;
      const isLiked = likeBtn.textContent === "❤️";
      if (isLiked) {
        likeBtn.textContent = "🤍";
        localStorage.removeItem("liked");
        return;
      }
      likeBtn.textContent = "❤️";
      localStorage.setItem("liked", "true");

    }
    useEffect(() => {
      const fetchPosts = async () => {
        try {
          const response = await fetch("http://localhost:3000/getposts");
          const data = await response.json();
          setPosts(data);
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      };
      fetchPosts();
    }, []);
  return (
    <div>
      <Nav />

      <div className="feedpage">Feed Page</div>
      <div className="feedsec">
        <div className="feed">
         {
            posts.map((post) => (
                 <div className="post">
            <div className="image">
              <img
                src={post.image}
                alt=""
              />
            </div>
            <div className="postopts">
              <div className="postinfo">
                <h3>{post.username}</h3>
                <p>{post.caption}</p>
              </div>
              <div onClick={handleLike} className="like">🤍</div>
            </div>
          </div>))
         }
          
        </div>
      </div>
      <div className="addpostbtn" onClick={addpost}>
        Add Post
      </div>
    </div>
  );
};

export default Feed;
