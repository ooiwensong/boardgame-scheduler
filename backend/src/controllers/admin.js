const db = require("../db/db");

const getAllUsers = async (req, res) => {
  try {
    const { rows } = await db.query(
      `
    SELECT *
    FROM users
    ORDER BY created_at`
    );

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

const deleteUser = async (req, res) => {
  try {
    await db.query(
      `
    DELETE FROM users
    WHERE uuid=$1`,
      [req.body.userId]
    );
    res.json({ status: "ok", msg: "user deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ status: "error", msg: "error deleting user" });
  }
};

module.exports = { getAllUsers, updateUserRole, deleteUser };
