const {
  isAlpha,
  isAlphanumeric,
  isEmail,
  isStrongPassword,
} = require("validator");

const validateUpdate = async (req, res, next) => {
  const { firstName, lastName, username, password, currentPassword } = req.body;
  let errObj = {};

  if (!isAlpha(firstName)) {
    errObj.firstName = "First Name cannot have special characters or numbers";
  }

  if (!isAlpha(lastName)) {
    errObj.lastName = "Last Name cannot have special characters or numbers";
  }

  if (!isAlphanumeric(username)) {
    errObj.username = "Username cannot have special characters";
  }

  if (!isStrongPassword(password)) {
    errObj.password =
      "Your password must contain 1 lowercase, 1 uppercase, 1 number, 1 special character and at least 8 characters long";
  }

  if (password !== currentPassword) {
    errObj.currentPassword = "Please enter correct current password";
  }

  if (Object.keys(errObj).length > 0) {
    return res.status(500).json({
      message: "error",
      error: errObj,
    });
  } else {
    next();
  }
};

module.exports = {
  validateUpdate,
};
