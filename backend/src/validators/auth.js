const { body } = require("express-validator");

const validateRegistrationData = [
  body("email", "Email field cannot be empty").notEmpty(),
  body("email", "Email is invalid").isEmail(),
  body("password", "Password field cannot be empty").notEmpty(),
  body(
    "password",
    "Password must have a minimum of 8 characters and 1 number"
  ).isStrongPassword({ minLength: 8, minNumbers: 1 }),
];

const validateLoginData = [
  body("email", "Email field cannot be empty").notEmpty(),
  body("email", "Email is invalid").isEmail(),
  body("password", "Password field cannot be empty").notEmpty(),
];

module.exports = { validateRegistrationData, validateLoginData };
