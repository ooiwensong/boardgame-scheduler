const express = require("express");
const { getUserProfile, editUserProfile } = require("../controllers/profiles");

const router = express.Router();

router.post("/", getUserProfile);
router.patch("/", editUserProfile);

module.exports = router;
