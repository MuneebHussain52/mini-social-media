import React, { useEffect, useState } from "react";
import axios from "axios";
import "../components/feedpage.css";

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [commentInputs, setCommentInputs] = useState({});
  const [visibleComments, setVisibleComments] = useState({});

  const token = localStorage.getItem("token");
  const API_BASE = "http://localhost:3000/api"; // backend URL

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/getposts`);
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts", err);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API_BASE}/createpost`,
        { text, image },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setText("");
      setImage("");
      fetchPosts();
    } catch (err) {
      console.error("Error creating post", err);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      await axios.put(
        `${API_BASE}/likepost/${postId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPosts();
    } catch (err) {
      console.error("Error liking post", err.response?.data || err.message);
    }
  };

  const toggleComments = (postId) => {
    setVisibleComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleAddComment = async (postId) => {
    try {
      const commentText = commentInputs[postId]?.trim();
      if (!commentText) return;

      await axios.put(
        `${API_BASE}/commentpost/${postId}`,
        { text: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
      fetchPosts(); // reload posts with updated comments
    } catch (err) {
      console.error("Error adding comment", err.response?.data || err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="feed-container">
      <nav className="navbar">
        <h1 className="logo">SocialFeed</h1>
        <div className="nav-links">
          <a href="/feedpage">Home</a>
          <a href="/profile/:id">Profile</a>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="create-post-card">
        <form onSubmit={handleCreatePost}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's on your mind?"
            required
          />
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Image URL (optional)"
          />
          <button type="submit">Post</button>
        </form>
      </div>

      <div className="posts-list">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className="post-card">
              <p className="post-user">{post.user?.name || "Anonymous"}</p>
              <p className="post-text">{post.text}</p>
              {post.image && <img src={post.image} alt="Post" />}
              <div className="post-actions">
                <span>{post.likes || 0} Likes</span>
                <button onClick={() => handleLikePost(post._id)}>
                  ❤️ Like
                </button>
                <button type="button" onClick={() => toggleComments(post._id)}>
                  💬 Comments
                </button>
              </div>

              {visibleComments[post._id] && (
                <div className="comments-section">
                  {post.comments && post.comments.length > 0 ? (
                    post.comments.map((c, idx) => (
                      <p key={idx} className="comment">
                        <strong>{c.user?.name || "Anonymous"}:</strong> {c.text}
                      </p>
                    ))
                  ) : (
                    <p className="no-comments">No comments yet</p>
                  )}

                  <div className="add-comment">
                    <input
                      type="text"
                      value={commentInputs[post._id] || ""}
                      onChange={(e) =>
                        setCommentInputs((prev) => ({
                          ...prev,
                          [post._id]: e.target.value,
                        }))
                      }
                      placeholder="Write a comment..."
                    />
                    <button onClick={() => handleAddComment(post._id)}>
                      Send
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="no-posts">No posts yet</p>
        )}
      </div>
    </div>
  );
}
