const db = require("../db/db");

// Get information of a user's profile
const getUserProfile = async (req, res) => {
  try {
    const profile = await db.query(
      `
    SELECT email, username, avatar, created_at
    FROM users
    WHERE uuid=$1`,
      [req.body.userId]
    );

    res.json(profile.rows[0]);
  } catch (error) {
    console.log(error.message);
    res
      .status(400)
      .json({ status: "ok", msg: "error retrieving user profile" });
  }
};

// Edit a specified attribute of a user's profile
const editUserProfile = async (req, res) => {
  try {
    await db.query(
      `
    UPDATE users
    SET ${req.body.attribute}=$1
    WHERE uuid=$2`,
      [req.body.value, req.body.userId]
    );

    res.json({ status: "ok", msg: "user profile updated successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ status: "ok", msg: "error editing user profile" });
  }
};

module.exports = { getUserProfile, editUserProfile };
