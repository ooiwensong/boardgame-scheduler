const { body } = require("express-validator");

const validateSessionForm = [
  body("game_title", "Game title is required").notEmpty(),
  body("max_guests", "Max number of guests is required").notEmpty(),
  body("date", "Date is required").notEmpty(),
  body("start_time", "Start time is required").notEmpty(),
  body("end_time", "End time is required").notEmpty(),
  body("address", "Address is required").notEmpty(),
];

const validateSessionId = [
  body("sessionId", "Session Id is required").notEmpty(),
  body("sessionId", "Session Id is invalid").isLength({ min: 36 }),
];

const validateUserId = [
  body("userId", "User Id is required").notEmpty(),
  body("userId", "User Id is invalid").isLength({ min: 36 }),
];

module.exports = { validateSessionForm, validateSessionId, validateUserId };
