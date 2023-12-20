const db = require("../db/db");

const getLibraryEntries = async (req, res) => {
  try {
    const entries = await db.query(
      `
    SELECT title
    FROM library
    WHERE title=$1`,
      [req.body.title]
    );
    res.json(entries.rows);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ status: "error", msg: "error retrieving library" });
  }
};

const createNewEntry = async (req, res) => {
  try {
    await db.query(
      `
    INSERT INTO library (id, title, year_published, image_url)
    VALUES ($1, $2, $3, $4)
    `,
      [req.body.id, req.body.title, req.body.year, req.body.imageURL]
    );

    res.json({ status: "ok", msg: "entry created successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ status: "error", msg: "error creating new entry" });
  }
};

module.exports = { getLibraryEntries, createNewEntry };
