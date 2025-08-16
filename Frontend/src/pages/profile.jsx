import React, { useEffect, useState } from "react";
import axios from "axios";
import "../components/profile.css";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]); // ✅ separate posts state

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const API_BASE = "http://localhost:3000/api";

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
      fetchUserPosts();
    }
  }, [userId]);

  // ✅ Get user details (name, email, profilePic)
  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(`${API_BASE}/getprofile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser({
        _id: res.data._id,
        name: res.data.name,
        email: res.data.email,
        profilePic: res.data.profilePic || "", // fallback if missing
      });
    } catch (err) {
      console.error("Error fetching profile", err);
    }
  };

  // ✅ Get posts separately
  const fetchUserPosts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/getuserpost/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.href = "/";
  };

  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="profile-container">
      <nav className="navbar">
        <h1 className="logo">SocialFeed</h1>
        <div className="nav-links">
          <a href="/feedpage">Home</a>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="profile-card">
        <div className="profile-header">
          <img
            className="profile-pic"
            src={
              user.profilePic && user.profilePic.trim() !== ""
                ? user.profilePic
                : "/default-profile.png"
            }
            alt="Profile"
          />
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>

        <h3>Your Posts</h3>
        <div className="profile-posts-grid">
          {posts.length === 0 ? (
            <p>You have not posted anything yet.</p>
          ) : (
            posts.map((post) => (
              <div key={post._id} className="profile-post-card">
                {post.image ? (
                  <img
                    className="profile-post-image"
                    src={post.image}
                    alt="Post"
                  />
                ) : (
                  <div className="profile-post-text-only">
                    <p>{post.text}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
