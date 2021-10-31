const jwt = require("jsonwebtoken");
const { log } = require("npmlog");

const jwtMiddleware = (req, res, next) => {
  try {
    if (req.headers && req.headers.authorization) {
      let token = req.headers.authorization.split(" ")[1];

      console.log(token);

      let decoded = jwt.verify(token, process.env.JWT_SECRET);

      res.locals.decoded = decoded;

      console.log(res.locals);

      next();
    } else {
      throw {
        message: "You don't have permission",
      };
    }
  } catch (e) {
    res.status(500).json({ message: "error", e });
  }
};

module.exports = {
  jwtMiddleware,
};
