const express = require("express");
const { createNewEntry, getLibraryEntries } = require("../controllers/library");
const { auth } = require("../middlewares/auth");

const router = express.Router();

router.post("/", auth, getLibraryEntries);
router.put("/", auth, createNewEntry);

module.exports = router;
