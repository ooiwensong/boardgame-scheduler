const express = require("express");
const { getAllUsers, updateUserRole } = require("../controllers/admin");
const { authAdmin } = require("../middlewares/auth");

const router = express.Router();

router.get("/users", authAdmin, getAllUsers);
router.patch("/users", authAdmin, updateUserRole);

module.exports = router;
