const isUndefined = async (req, res, next) => {
  Object.keys(req.body).length === 0 || req.body === undefined
    ? res
        .status(500)
        .json({ message: "error, body not found, please fill out fields" })
    : next();
};

module.exports = {
  isUndefined,
};
