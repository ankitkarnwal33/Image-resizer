const express = require("express");
const cors = require("cors");
const cookieParse = require("cookie-parser");
require("dotenv").config();
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

const db = require("./DB");
const imageRouter = require("./router/imagesRoute.js");
const userRouter = require("./router/userRoute.js");
const authenticate = require("./middleware/authenticate.js");
// default middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(cookieParse());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html")); // Serve an HTML file as default
});
// app.get("/", authenticate, (req, res) => {
//   res.status(200).json({
//     status: "success",
//     message: "This is dashboard route!",
//     data: req.user,
//   });
// });

// app.get("/dashboard", authenticate, (req, res) => {
//   res.status(200).json({
//     status: "success",
//     message: "This is dashboard route!",
//     data: req.user,
//   });
// });

// Router
app.use("/api/image/", imageRouter);
app.use("/api/user/", userRouter);

// Listen on the port
app.listen(PORT, () => {});
