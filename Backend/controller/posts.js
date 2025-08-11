const express = require("express");
const router = express.Router();
const Post = require("../modal/posts-schema");
const auth = require("../controller/auth/auth");
const userController = require("./auth/auth");
const User = require("../modal/user-schema");
const postschema = require("../modal/posts-schema");

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", "name");
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error });
  }
};

exports.createpost = async (req, res) => {
  try {
    const post = new Post({
      user: req.user._id,
      text: req.body.text,
      image: req.body.image,
    });
    await post.save();
    const populatedPost = await Post.findOne({ _id: post._id }).populate(
      "user"
    );

    res
      .status(201)
      .json({ message: "Post created successfully", post: populatedPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating post" });
  }
};

exports.likepost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    post.likes = post.likes + 1;
    await post.save();
    res.status(200).json({ message: "Post liked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error liking post", error });
  }
};

exports.commentpost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    const post = await Post.findOneAndUpdate(
      { _id: postId },
      {
        $addToSet: {
          comments: {
            $each: text.map((comment) => ({
              user: req.user._id,
              text: comment,
            })),
          },
        },
        $inc: { commentCount: text.length },
      },
      { new: true }
    );
    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found" })
        .populate("user", "name");
    }
    res.status(200).json({ message: "Comment added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error });
  }
};

exports.deletepost = async (req, res) => {
  try {
    const { postId } = req.params;
    if (!postId) {
      return res.status(400).json({ message: "Post ID is required" });
    }

    const result = await Post.deleteOne({ _id: postId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting post", error });
  }
};

exports.updatepost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    post.text = text;
    await post.save();
    res.status(200).json({ message: "Post updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating post", error });
  }
};

exports.getpost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Error fetching post", error });
  }
};

exports.getuserpost = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ user: userId });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user posts", error });
  }
};

exports.getpostcomment = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post.comments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching post comments", error });
  }
};

exports.getpostlike = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post.likes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching post likes", error });
  }
};

exports.getpostlikecount = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post.likeCount);
  } catch (error) {
    res.status(500).json({ message: "Error fetching post like count", error });
  }
};

exports.getpostcommentcount = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post.commentCount);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching post comment count", error });
  }
};

exports.getprofile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate("posts");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const posts = await Post.find({ user: userId });
    const userProfile = {
      _id: user._id,
      name: user.name,
      email: user.email,
      posts: posts,
    };
    res.status(200).json(userProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting user profile", error });
  }
};
