const db = require("../db/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { rows } = await db.query(
      `
    SELECT *
    FROM users
    WHERE email = $1`,
      [req.body.email]
    );

    const [userResults] = rows;

    if (!userResults) {
      console.log("user is not registered");
      return res
        .status(400)
        .json({ status: "error", error: [{ msg: "User is not registered" }] });
    }

    const passwordResults = await bcrypt.compare(
      req.body.password,
      userResults.hash
    );
    if (!passwordResults) {
      console.log("email or password is incorrect");
      return res
        .status(400)
        .json({
          status: "error",
          error: [{ msg: "Email or password is incorrect." }],
        });
    }

    const claims = {
      userId: userResults.uuid,
      email: userResults.email,
      role: userResults.role,
      username: userResults.username,
      avatar: userResults.avatar,
    };
    const accessToken = jwt.sign(claims, process.env.ACCESS_SECRET, {
      expiresIn: "30d",
    });
    const refreshToken = jwt.sign(claims, process.env.REFRESH_SECRET, {
      expiresIn: "30d",
    });

    res.json({ accessToken, refreshToken });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", msg: "Login unsuccessful" });
  }
};

const register = async (req, res) => {
  try {
    const { rows } = await db.query(
      `
    SELECT * 
    FROM users 
    WHERE email = $1`,
      [req.body.email]
    );

    [userResults] = rows;

    if (userResults)
      return res
        .status(400)
        .json({ status: "error", msg: "Email already exists." });

    const hash = await bcrypt.hash(req.body.password, 12);
    await db.query(
      `
    INSERT INTO users (email, hash, username)
    VALUES ($1, $2, $3)`,
      [req.body.email, hash, req.body.username]
    );

    res.json({ status: "ok", msg: "user created successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: "error", msg: "Error creating user." });
  }
};

const refresh = async (req, res) => {
  try {
    const decoded = jwt.decode(req.body.refresh, process.env.REFRESH_SECRET);

    const claims = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      username: decoded.username,
      avatar: decoded.avatar,
    };
    const accessToken = jwt.sign(claims, process.env.ACCESS_SECRET, {
      expiresIn: "30d",
    });

    res.json({ accessToken });
  } catch (error) {
    console.log(error.message);
    res
      .status(400)
      .json({ status: "error", msg: "refresh token unsuccessful" });
  }
};

module.exports = { login, register, refresh };
