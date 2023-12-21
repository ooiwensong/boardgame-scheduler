const express = require("express");
const { login, register, refresh } = require("../controllers/auth");
const {
  validateLoginData,
  validateRegistrationData,
} = require("../validators/auth");
const validation = require("../validators/common");

const router = express.Router();

router.post("/login", validateLoginData, validation, login);
router.put("/register", validateRegistrationData, validation, register);
router.post("/refresh", refresh);

module.exports = router;
