const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  if (!("authorization" in req.headers)) {
    return res.status(400).json({ status: "error", msg: "token not found" });
  }
  const token = req.headers["authorization"].replace("Bearer ", "");
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
      req.decoded = decoded;
      next();
    } catch (error) {
      console.log(error.message);
      return res.status(400).json({ status: "error", msg: "unauthorised" });
    }
  } else {
    return res.status(400).json({ status: "error", msg: "token not found" });
  }
};

const authAdmin = (req, res, next) => {
  if (!("authorization" in req.headers)) {
    return res.status(400).json({ status: "error", msg: "token not found" });
  }
  const token = req.headers["authorization"].replace("Bearer ", "");
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
      if (decoded.role === "ADMIN") {
        req.decoded = decoded;
        next();
      } else {
        throw new Error("user is not authorised to perform this action");
      }
    } catch (error) {
      console.log(error.message);
      return res.status(400).json({ status: "error", msg: "unauthorised" });
    }
  } else {
    return res.status(400).json({ status: "error", msg: "token not found" });
  }
};

module.exports = { auth, authAdmin };
