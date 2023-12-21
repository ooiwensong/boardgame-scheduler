const { validationResult } = require("express-validator");

const validation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  } else {
    next();
  }
};

module.exports = validation;
