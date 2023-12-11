const express = require("express");
const {
  getMyHostSessions,
  createSession,
  deleteSession,
  joinSession,
  leaveSession,
  getSingleSession,
} = require("../controllers/sessions");
const { auth } = require("../middlewares/auth");

const router = express.Router();

router.get("/sessions", auth, getSingleSession);
router.get("/hostsessions", auth, getMyHostSessions);
router.put("/sessions", auth, createSession);
router.delete("/sessions", auth, deleteSession);
router.post("/joinsession", auth, joinSession);
router.post("/leavesession", auth, leaveSession);

module.exports = router;
