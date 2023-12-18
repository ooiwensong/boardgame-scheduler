const express = require("express");
const {
  getAllUsers,
  updateUserRole,
  deleteUser,
} = require("../controllers/admin");
const { authAdmin } = require("../middlewares/auth");

const router = express.Router();

router.get("/users", authAdmin, getAllUsers);
router.patch("/users", authAdmin, updateUserRole);
router.delete("/users", authAdmin, deleteUser);

module.exports = router;
