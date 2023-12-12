const db = require("../db/db");

const getAllUsers = async (req, res) => {
  try {
    const { rows } = await db.query("SELECT * FROM users");

    res.json(rows);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ status: "ok", msg: "error retrieving users" });
  }
};

const updateUserRole = async (req, res) => {
  try {
    await db.query(
      `
    UPDATE users
    SET role=$1
    WHERE uuid=$2`,
      [req.body.role, req.body.userId]
    );

    res.json({ status: "ok", msg: "user role updated successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ status: "ok", msg: "error retrieving users" });
  }
};

module.exports = { getAllUsers, updateUserRole };
