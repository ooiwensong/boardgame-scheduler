require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const authRouter = require("./src/routers/auth");
const sessionsRouter = require("./src/routers/sessions");
const adminRouter = require("./src/routers/admin");

const app = express();

app.use(cors());
app.use(helmet());
app.use(
  rateLimit({
    windowMS: 15 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeades: false,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", authRouter);

app.use("/api", sessionsRouter);

app.use("/admin", adminRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
