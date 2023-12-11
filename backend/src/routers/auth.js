const express = require("express");
const { login, register, refresh } = require("../controllers/auth");

const router = express.Router();

router.post("/login", login);
router.put("/register", register);
router.post("/refresh", refresh);

module.exports = router;
