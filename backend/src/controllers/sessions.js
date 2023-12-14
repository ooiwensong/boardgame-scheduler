const db = require("../db/db");

// Get information about a single session
const getSingleSession = async (req, res) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const sessionData = await client.query(
      `
    SELECT * 
    FROM sessions
    WHERE uuid=$1`,
      [req.body.sessionId]
    );

    const sessionGuests = await client.query(
      `
    SELECT guest_id, date_joined 
    FROM guests 
    WHERE guests.session_id = $1`,
      [req.body.sessionId]
    );

    await client.query("COMMIT");

    res.json({
      sessionData: sessionData.rows,
      sessionGuests: sessionGuests.rows,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.log(error.message);
    res
      .status(400)
      .json({ status: "error", msg: "error retrieving session data" });
  } finally {
    client.release();
  }
};

// Get information about sessions a user is hosting
const getMyHostSessions = async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT * 
      FROM sessions 
      WHERE host_id = $1`,
      [req.body.userId]
    );
    res.json(rows);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ status: "error", msg: "error retrieving sessions" });
  }
};

// Get information about sessions a user is hosting and/or has joined
const getMySessions = async (req, res) => {
  try {
    const mySessions = await db.query(
      `
    SELECT *
    FROM sessions
    WHERE host_id=$1
    UNION
    SELECT uuid, host_id, game_title, max_guests, num_guests, date, start_time, end_time, address, is_full, expires_at, created_at, last_updated, game_image
    FROM sessions
    JOIN guests ON guests.session_id = sessions.uuid
    WHERE guest_id=$2
    ORDER BY date, start_time`,
      [req.body.userId, req.body.userId]
    );
    res.json(mySessions.rows);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ status: "error", msg: "error retrieving sessions" });
  }
};

const getOtherUserSessions = async (req, res) => {
  try {
    const sessions = await db.query(
      `
    SELECT *
    FROM sessions
    WHERE host_id != $1`,
      [req.body.userId]
    );

    res.json(sessions.rows);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ status: "error", msg: "error retrieving sessions" });
  }
};

// Create and host a session
const createSession = async (req, res) => {
  try {
    await db.query(
      `
    INSERT INTO sessions (host_id, game_title, game_image, max_guests, date, start_time, end_time, address)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        req.body.userId,
        req.body.game_title,
        req.body.game_image,
        req.body.max_guests,
        req.body.date,
        req.body.start_time,
        req.body.end_time,
        req.body.address,
      ]
    );

    res.json({ status: "ok", msg: "session created successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ status: "error", msg: "error creating sessions" });
  }
};

const editSession = async (req, res) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    for (const attribute in req.body) {
      await client.query(
        `
      UPDATE sessions
      SET ${attribute}=$1
      WHERE uuid=$2`,
        [req.body[attribute], req.params.sessionId]
      );
    }

    await client.query("COMMIT");

    res.json({ status: "ok", msg: "session updated successfully" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.log(error.message);
    res.status(400).json({ status: "error", msg: "error editing sessions" });
  } finally {
    client.release();
  }
};

// Delete a session hosted by current user
const deleteSession = async (req, res) => {
  try {
    await db.query(
      `
    DELETE FROM sessions
    WHERE uuid = $1`,
      [req.body.sessionId]
    );

    res.json({ status: "ok", msg: "session deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ status: "error", msg: "error deleting session" });
  }
};

// Join a session hosted by another user
const joinSession = async (req, res) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const host = await client.query(
      `
    SELECT host_id
    FROM sessions
    WHERE uuid=$1`,
      [req.body.sessionId]
    );
    if (host.rows[0].host_id === req.body.userId) {
      return res.status(400).json({
        status: "error",
        msg: "cannot join a session you are hosting",
      });
    }

    const { rows } = await client.query(
      `
    SELECT is_full
    FROM sessions
    WHERE uuid=$1`,
      [req.body.sessionId]
    );
    if (rows[0].is_full) {
      return res
        .status(400)
        .json({ status: "error", msg: "unable to join session as it is full" });
    }

    await client.query(
      `
    INSERT INTO guests (session_id, guest_id)
    VALUES ($1, $2)`,
      [req.body.sessionId, req.body.userId]
    );

    await client.query("COMMIT");

    res.json({ status: "ok", msg: "session joined successfully" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.log(error.message);
    res.status(400).json({ status: "error", msg: "error joining session" });
  } finally {
    client.release();
  }
};

// Leave a session hosted by another user
const leaveSession = async (req, res) => {
  try {
    await db.query(
      `
    DELETE FROM guests
    WHERE session_id=$1
    AND guest_id=$2`,
      [req.body.sessionId, req.body.userId]
    );

    res.json({ status: "ok", msg: "left session successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ status: "error", msg: "error leaving session" });
  }
};

module.exports = {
  getSingleSession,
  getMyHostSessions,
  getMySessions,
  getOtherUserSessions,
  createSession,
  deleteSession,
  editSession,
  joinSession,
  leaveSession,
};
