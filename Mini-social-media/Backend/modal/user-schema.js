const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],

  bio: { type: String, default: "" },
  profilePic: { type: String, default: "" },
  followers: { type: Number, default: 0 },
  following: { type: Number, default: 0 },
});

module.exports = mongoose.model("User", userSchema);
