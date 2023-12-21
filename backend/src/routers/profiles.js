const express = require("express");
const { getUserProfile, editUserProfile } = require("../controllers/profiles");
const { validateUserId } = require("../validators/sessions");
const validation = require("../validators/common");

const router = express.Router();

router.post("/", validateUserId, validation, getUserProfile);
router.patch("/", editUserProfile);

module.exports = router;
