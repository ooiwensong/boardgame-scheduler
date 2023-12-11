const db = require("../db/db");

const getSingleSession = async (req, res) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    // const getSessionDataText = 'SELECT '
    const sessionData = await client.query(
      "SELECT * FROM sessions WHERE uuid=$1",
      [req.body.sessionId]
    );

    const getSessionGuestText =
      "SELECT uuid AS userId, email, username, avatar, date_joined FROM guests JOIN users ON guests.guest_id = users.uuid WHERE guests.session_id = $1";
    const getSessionGuestValues = [req.body.sessionId];
    const sessionGuests = await client.query(
      getSessionGuestText,
      getSessionGuestValues
    );

    await client.query("COMMIT");

    res.json({
      sessionData: sessionData.rows,
      sessionGuests: sessionGuests.rows,
    });
  } catch (error) {
    console.log(error.message);
    res
      .status(400)
      .json({ status: "error", msg: "error retrieving session data" });
  } finally {
    client.release();
  }
};

const getMyHostSessions = async (req, res) => {
  try {
    const { rows } = await db.query(
      "SELECT * FROM sessions WHERE host_id = $1",
      [req.body.userId]
    );
    res.json(rows);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ status: "error", msg: "error retrieving sessions" });
  }
};

const getMySessions = async (req, res) => {
  try {
  } catch (error) {}
};

const createSession = async (req, res) => {
  try {
    const createSessionText =
      "INSERT INTO sessions (host_id, game_title, game_image, max_guests, date, start_time, end_time, address) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)";
    const createSessionValues = [
      req.body.userId,
      req.body.game_title,
      req.body.game_image,
      req.body.max_guests,
      req.body.date,
      req.body.start_time,
      req.body.end_time,
      req.body.address,
    ];
    await db.query(createSessionText, createSessionValues);

    res.json({ status: "ok", msg: "session created successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ status: "error", msg: "error creating sessions" });
  }
};

const joinSession = async (req, res) => {
  try {
    const joinSessionText =
      "INSERT INTO guests (session_id, guest_id) VALUES ($1, $2)";
    const joinSessionValues = [req.body.sessionId, req.body.userId];
    await db.query(joinSessionText, joinSessionValues);

    res.json({ status: "ok", msg: "session joined successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ status: "error", msg: "error joining session" });
  }
};

const leaveSession = async (req, res) => {
  try {
    const leaveSessionText =
      "DELETE FROM guests WHERE session_id=$1 AND guest_id=$2";
    const leaveSessionValues = [req.body.sessionId, req.body.userId];
    await db.query(leaveSessionText, leaveSessionValues);

    res.json({ status: "ok", msg: "left session successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ status: "error", msg: "error leaving session" });
  }
};

const deleteSession = async (req, res) => {
  try {
    await db.query("DELETE FROM sessions WHERE uuid = $1", [
      req.body.sessionId,
    ]);

    res.json({ status: "ok", msg: "session deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ status: "error", msg: "error deleting session" });
  }
};

module.exports = {
  getSingleSession,
  getMyHostSessions,
  createSession,
  joinSession,
  leaveSession,
  deleteSession,
};
