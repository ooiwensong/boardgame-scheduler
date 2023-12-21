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
      sessionData: sessionData.rows[0],
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
    const hostSessions = await db.query(
      `SELECT s.uuid, s.host_id, s.game_title, s.max_guests, s.num_guests, s.date, s.start_time, s.end_time, s.address, s.is_full, s.expires_at, s.created_at, s.last_updated, s.game_image, array_agg(guests.guest_id) "guests"
      FROM sessions AS s
      FULL JOIN guests ON s.uuid = guests.session_id
      WHERE host_id=$1
      GROUP BY s.uuid
      ORDER BY date, start_time`,
      [req.body.userId]
    );
    res.json(hostSessions.rows);
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
      SELECT s.uuid, s.host_id, s.game_title, s.max_guests, s.num_guests, s.date, s.start_time, s.end_time, s.address, s.is_full, s.expires_at, s.created_at, s.last_updated, s.game_image, array_agg(guests.guest_id) "guests"
      FROM sessions AS s
      FULL JOIN guests ON s.uuid = guests.session_id
      WHERE host_id=$1 OR guest_id=$2
      GROUP BY s.uuid
      ORDER BY date, start_time`,
      [req.body.userId, req.body.userId]
    );
    res.json(mySessions.rows);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ status: "error", msg: "error retrieving sessions" });
  }
};

// Get information about sessions hosted by other users
const getOtherUserSessions = async (req, res) => {
  try {
    const sessions = await db.query(
      `
      SELECT s.uuid, s.host_id, s.game_title, s.max_guests, s.num_guests, s.date, s.start_time, s.end_time, s.address, s.is_full, s.expires_at, s.created_at, s.last_updated, s.game_image, array_agg(guests.guest_id) "guests"
      FROM sessions as s
      FULL JOIN guests ON s.uuid = guests.session_id
      WHERE host_id !=$1
      GROUP BY s.uuid
      ORDER BY date, start_time`,
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
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    if (req.decoded.userId !== req.body.userId) {
      return res.status(403).json({ status: "error", msg: "not authorised" });
    }

    await client.query(
      `
    INSERT INTO sessions (host_id, game_title, max_guests, date, start_time, end_time, address, game_image)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        req.body.userId,
        req.body.game_title,
        req.body.max_guests,
        req.body.date,
        req.body.start_time,
        req.body.end_time,
        req.body.address,
        req.body.game_image,
      ]
    );

    await client.query("COMMIT");

    res.json({ status: "ok", msg: "session created successfully" });
  } catch (error) {
    console.log(error.message);
    await client.query("ROLLBACK");
    res.status(400).json({ status: "error", msg: "error creating sessions" });
  } finally {
    client.release();
  }
};

const editSession = async (req, res) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const host_id = await client.query(
      `
    SELECT host_id
    FROM sessions
    WHERE uuid=$1`,
      [req.params.sessionId]
    );
    if (host_id.rows[0].host_id !== req.decoded.userId) {
      return res.status(400).json({ status: "error", msg: "not authorised" });
    }

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
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const host_id = await client.query(
      `
    SELECT host_id
    FROM sessions
    WHERE uuid=$1`,
      [req.body.sessionId]
    );

    if (host_id.rows[0].host_id !== req.decoded.userId) {
      return res.status(403).json({ status: "error", msg: "not authorised" });
    }

    await client.query(
      `
    DELETE FROM sessions
    WHERE uuid = $1`,
      [req.body.sessionId]
    );

    await client.query("COMMIT");

    res.json({ status: "ok", msg: "session deleted successfully" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.log(error.message);
    res.status(400).json({ status: "error", msg: "error deleting session" });
  } finally {
    client.release();
  }
};

// Join a session hosted by another user
const joinSession = async (req, res) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    if (req.body.userId !== req.decoded.userId) {
      return res.status(403).json({ status: "error", msg: "not authorised" });
    }

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
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    if (req.body.userId !== req.decoded.userId) {
      return res.status(403).json({ status: "error", msg: "not authorised" });
    }

    await client.query(
      `
    DELETE FROM guests
    WHERE session_id=$1
    AND guest_id=$2`,
      [req.body.sessionId, req.body.userId]
    );

    await client.query("COMMIT");

    res.json({ status: "ok", msg: "left session successfully" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.log(error.message);
    res.status(400).json({ status: "error", msg: "error leaving session" });
  } finally {
    client.release();
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
