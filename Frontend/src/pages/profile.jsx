import React, { useEffect, useState } from "react";
import axios from "axios";
import "../components/profile.css";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [editing, setEditing] = useState(false);

  const token = localStorage.getItem("token");
  const API_BASE = "http://localhost:3000/api";

  // Fetch user profile data
  useEffect(() => {
    fetchUserProfile();
    fetchUserPosts();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(`${API_BASE}/getprofile/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
      setBio(res.data.user.bio || "");
      setProfilePic(res.data.user.profilePic || "");
    } catch (err) {
      console.error("Error fetching profile", err);
    }
  };

  // Fetch posts by this user
  const fetchUserPosts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/getuserposts/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data.posts);
    } catch (err) {
      console.error("Error fetching user posts", err);
    }
  };

  const handleSaveProfile = async () => {
    try {
      await axios.put(
        `${API_BASE}/updateprofile`,
        { bio, profilePic },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditing(false);
      fetchUserProfile();
    } catch (err) {
      console.error("Error updating profile", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="profile-container">
      <nav className="navbar">
        <h1 className="logo">SocialFeed</h1>
        <div className="nav-links">
          <a href="/">Home</a>
          <a href="/feed">Feed</a>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="profile-card">
        <div className="profile-header">
          <img
            className="profile-pic"
            src={profilePic || "/default-profile.png"}
            alt="Profile"
          />
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>

        {editing ? (
          <div className="edit-profile">
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Update your bio"
            />
            <input
              type="text"
              value={profilePic}
              onChange={(e) => setProfilePic(e.target.value)}
              placeholder="Profile picture URL"
            />
            <button onClick={handleSaveProfile}>Save</button>
            <button onClick={() => setEditing(false)}>Cancel</button>
          </div>
        ) : (
          <div className="profile-bio">
            <p>{bio || "No bio added yet"}</p>
            <button onClick={() => setEditing(true)}>Edit Profile</button>
          </div>
        )}

        <h3>Your Posts</h3>
        <div className="posts-list">
          {posts.length === 0 && <p>You have not posted anything yet.</p>}
          {posts.map((post) => (
            <div key={post._id} className="post-card">
              <p className="post-text">{post.text}</p>
              {post.image && <img src={post.image} alt="Post" />}
              <span>{post.likes || 0} Likes</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
