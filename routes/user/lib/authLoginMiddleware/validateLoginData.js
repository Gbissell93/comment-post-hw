const { isEmail } = require("validator");

const loginValidator = (req, res, next) => {
  const { email } = req.body;

  let errObj = {};

  if (!isEmail(email)) {
    errObj.email = "Please enter a valid email address";
  }

  if (Object.keys(errObj).length > 0) {
    return res.status(500).json({ message: "error", error: errObj });
  } else {
    next();
  }
};

module.exports = {
  loginValidator,
};
