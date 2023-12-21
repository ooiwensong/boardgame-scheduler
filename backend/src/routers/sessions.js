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
const {
  validateSessionForm,
  validateSessionId,
  validateUserId,
} = require("../validators/sessions");
const validation = require("../validators/common");

const router = express.Router();

router.post("/", auth, validateSessionId, validation, getSingleSession);
router.put(
  "/",
  auth,
  validateSessionForm,
  validateUserId,
  validation,
  createSession
);
router.delete("/", auth, validateSessionId, validation, deleteSession);
router.patch("/:sessionId", auth, validateSessionForm, validation, editSession);

router.post("/my-sessions", auth, validateUserId, validation, getMySessions);
router.post(
  "/host-sessions",
  auth,
  validateUserId,
  validation,
  getMyHostSessions
);
router.post(
  "/other-user-sessions",
  auth,
  validateUserId,
  validation,
  getOtherUserSessions
);

router.post(
  "/join-session",
  auth,
  validateSessionId,
  validateUserId,
  validation,
  joinSession
);
router.post(
  "/leave-session",
  auth,
  validateSessionId,
  validateUserId,
  validation,
  leaveSession
);

module.exports = router;
