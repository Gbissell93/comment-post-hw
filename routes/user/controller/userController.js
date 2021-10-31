require("dotenv").config();
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const createUser = async (req, res, next) => {
  let body = req.body;
  let errObj = {};
  const { firstName, lastName, username, email, password } = req.body;

  if (Object.keys(errObj).length > 0) {
    res.status(500).json({ message: "error", error: errObj });
  } else {
    try {
      let salt = await bcrypt.genSalt(10);
      let hashedword = await bcrypt.hash(password, salt);

      const createdUser = new User({
        firstName,
        lastName,
        username,
        email,
        password: hashedword,
      });

      let savedUser = await createdUser.save();

      res.json({
        message: `welcome ${firstName}, new account created`,
        payload: savedUser,
      });
    } catch (error) {
      res.status(500).json({ message: "error", error: error.message });
    }
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let foundUser = await User.findOne({ email: email });

    if (!foundUser) {
      return res.status(500).json({
        message: "error",
        error: "invalid username or password. please try again",
      });
    } else {
      let passwordCheck = await bcrypt.compare(password, foundUser.password);
      // console.log(foundUser);

      if (!passwordCheck) {
        return res.status(500).json({
          message: "error",
          error: "invalid username or password. please try again",
        });
      } else {
        let token = jwt.sign(
          {
            email: foundUser.email,
            password: foundUser.password,
          },
          process.env.JWT_SECRET,
          { expiresIn: "2d" }
        );

        res.json({ message: "success", payload: token });
      }
      console.log(foundUser);
    }
  } catch (e) {
    res.status(500).json({ message: "error", error: e.message });
  }
};

async function updateUser(req, res) {
  try {
    const { firstName, lastName, username, password } = req.body;

    let token = req.headers.authorization.split(" ")[1];

    let decoded = jwt.verify(token, process.env.JWT_SECRET);

    let salt = await bcrypt.genSalt(10);
    let hashedword = await bcrypt.hash(password, salt);

    req.body.password = hashedword;

    let updatedUser = await User.findOneAndUpdate(
      { email: decoded.email },
      req.body,
      { new: true }
    );
    let payload = updatedUser;
    res.json({ message: "Profile Updated", payload: payload });
  } catch (e) {
    res.status(500).json({ message: "error", error: e.message });
  }
}

module.exports = {
  createUser,
  login,
  updateUser,
};
