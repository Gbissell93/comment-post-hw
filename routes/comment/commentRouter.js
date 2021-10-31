var express = require("express");
var router = express.Router();

const { jwtMiddleware } = require("../shared/jwt");
const {
  createComment,
  getAllUserComment,
  deleteCommentById,
  updateCommentById,
} = require("./controller/commentController");
/* GET home page. */
router.get("/", function (req, res, next) {
  res.json({ message: "comment" });
});

router.get("/user-comments", jwtMiddleware, getAllUserComment);

router.post("/create-comment/:id", jwtMiddleware, createComment);

router.delete("/delete-comment/:id", jwtMiddleware, deleteCommentById);
router.put("/update-comment/:id", jwtMiddleware, updateCommentById);

module.exports = router;
