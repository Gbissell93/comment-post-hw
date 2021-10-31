const express = require("express");
const router = express.Router();

const {
  checkIsEmpty,
  validateCreateData,
  isUndefined,
  loginValidator,
  jwtMiddleware,
  validateUpdate,
} = require(".");
const {
  createUser,
  login,
  updateUser,
} = require("./controller/userController");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.json("respond with a resource");
});

router.post(
  "/new-user",
  isUndefined,
  checkIsEmpty,
  validateCreateData,
  createUser
);

router.post("/login", isUndefined, checkIsEmpty, loginValidator, login);

router.put(
  "/profile",
  jwtMiddleware,
  isUndefined,
  checkIsEmpty,
  validateUpdate,
  updateUser
);

module.exports = router;
