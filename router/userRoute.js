const express = require("express");
const {
  signInUser,
  signUpUser,
  logoutUser,
} = require("../controller/userController");
const router = express.Router();
router.post("/signin", signInUser);
router.post("/signup", signUpUser);
router.post("/logout", logoutUser);
const userRouter = router;
module.exports = userRouter;
