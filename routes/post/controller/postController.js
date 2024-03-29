const Post = require("../model/Post");
const User = require("../../user/model/User");
const objectID = require("mongoose").Types.ObjectId;

async function createPost(req, res) {
  try {
    const { title, post } = req.body;

    const decoded = res.locals.decoded;

    let foundUser = await User.findOne({ email: decoded.email });

    const newPost = new Post({
      title,
      post,
      owner: foundUser._id,
    });

    foundUser.postHistory.push(savedPost._id);

    await foundUser.save();

    res.json({ message: "success", payload: savedPost });
  } catch (e) {
    res.status(500).json({ message: "error", error: e.message });
  }
}

async function getAllPost(req, res) {
  try {
    let foundAllPost = await Post.find({}).populate("owner", "username");

    res.json({ message: "success", payload: foundAllPost });
  } catch (e) {
    res.status(500).json({ message: "error", error: e.message });
  }
}

async function deletePostByID(req, res) {
  try {
    let foundPost = await Post.findById(req.params.id);
    const decoded = res.locals.decoded;

    let foundUser = await User.findOne({ email: decoded.email });

    if (String(foundPost.owner) === String(foundUser._id)) {
      let deletedPost = await Post.findByIdAndDelete(req.params.id);

      let userPostArray = foundUser.postHistory;

      let filterdPostArray = userPostArray.filter(
        (post) => `${post._id}` !== `${deletedPost._id}`
      );

      foundUser.postHistory = filterdPostArray;

      await foundUser.save();

      res.json({ message: "success", payload: deletedPost });
    } else {
      res
        .status(500)
        .json({ message: "failure", error: "You don't have permission" });
    }
  } catch (e) {
    res.status(500).json({ message: "error", error: e.message });
  }
}

async function updatePostByID(req, res) {
  try {
    if (!objectID.isValid(req.params.id)) {
      return res
        .status(500)
        .json({ message: "failure", error: "Not a validID" });
    }

    let updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updatedPost) {
      res
        .status(404)
        .json({ message: "failure", error: "Post not found, check again" });
    } else {
      res.json({ message: "success", payload: updatedPost });
    }
  } catch (e) {
    res.status(500).json({ message: "error", error: e.message });
  }
}

module.exports = {
  createPost,
  getAllPost,
  deletePostByID,
  updatePostByID,
};
