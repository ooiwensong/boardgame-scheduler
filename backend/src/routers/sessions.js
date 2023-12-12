const express = require("express");
const {
  getMyHostSessions,
  createSession,
  deleteSession,
  joinSession,
  leaveSession,
  getSingleSession,
  getMySessions,
  getOtherUserSessions,
  editSession,
} = require("../controllers/sessions");
const { auth } = require("../middlewares/auth");

const router = express.Router();

router.post("/", auth, getSingleSession);
router.put("/", auth, createSession);
router.delete("/", auth, deleteSession);
router.patch("/:sessionId", auth, editSession);

router.post("/my-sessions", auth, getMySessions);
router.post("/host-sessions", auth, getMyHostSessions);
router.post("/other-user-sessions", auth, getOtherUserSessions);

router.post("/join-session", auth, joinSession);
router.post("/leave-session", auth, leaveSession);

module.exports = router;
