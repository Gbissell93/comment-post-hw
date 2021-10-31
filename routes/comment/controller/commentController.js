const Comment = require("../model/Comment");
const User = require("../../user/model/User");
const Post = require("../../post/model/Post");

async function getAllUserComment(req, res) {
  try {
    const decoded = res.locals.decoded;

    let foundUser = await User.findOne({ email: decoded.email });

    let allComments = await Comment.find({ owner: foundUser._id });

    res.json({ message: "success", payload: allComments });
  } catch (e) {
    res.status(500).json({ message: "error", error: e.message });
  }
}

async function createComment(req, res) {
  try {
    const decoded = res.locals.decoded;

    let foundUser = await User.findOne({ email: decoded.email });

    let createComment = new Comment({
      comment: req.body.comment,
      post: req.params.id,
      user: foundUser._id,
    });

    let savedComment = await createComment.save();

    foundUser.commentHistory.push(savedComment._id);

    await foundUser.save();

    let foundPost = await Post.findById(req.params.id);

    foundPost.commentHistory.push(savedComment._id);

    await foundPost.save();

    res.json({ message: "success", payload: savedComment });
  } catch (e) {
    res.status(500).json({ message: "error", error: e.message });
  }
}

async function deleteCommentById(req, res) {
  try {
    let deletedComment = await Comment.findByIdAndDelete(req.params.id);

    let foundPost = await Post.findById(deletedComment.post);

    let foundPostCommentArray = foundPost.commentHistory;

    let filteredPostCommentArray = foundPostCommentArray.filter(
      (comment) => `${comment._id}` !== `${deletedComment._id}`
    );

    foundPost.commentHistory = filteredPostCommentArray;

    await foundPost.save();

    const decoded = res.locals.decoded;

    let foundUser = await User.findOne({ email: decoded.email });

    let foundUserCommentArray = foundUser.commentHistory;

    let filteredUserCommentArray = foundUserCommentArray.filter(
      (comment) => `${comment._id}` !== `${deletedComment._id}`
    );

    foundUser.commentHistory = filteredUserCommentArray;

    await foundUser.save();

    res.json({ message: "success", payload: deletedComment });
  } catch (e) {
    res.status(500).json({ message: "error", error: e.message });
  }
}

async function updateCommentById(req, res) {
  try {
    let foundComment = await Comment.findById(req.params.id);

    const decoded = res.locals.decoded;

    let foundUser = await User.findOne({ email: decoded.email });

    if (`${foundComment.user}` === `${foundUser._id}`) {
      let updatedComment = await Comment.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

      res.json({ message: "success", payload: updatedComment });
    } else {
      res
        .status(500)
        .json({ message: "error", error: "You don't have permission" });
    }
  } catch (e) {
    res.status(500).json({ message: "error", error: e.message });
  }
}

module.exports = {
  createComment,
  getAllUserComment,
  deleteCommentById,
  updateCommentById,
};
