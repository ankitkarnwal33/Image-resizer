const jwt = require("jsonwebtoken");
const db = require("../DB");
const { hashPassword, verifyPassword } = require("../lib/passwordGenerator");

const signInUser = async (req, res) => {
  const data = JSON.parse(req.body.data);
  const { email, password } = data;
  try {
    if (!email) throw new Error("Incorrect email or password!");
    if (!password) throw new Error("Incorrect email or password!");
    db.update();
    const user = db.users.find((user) => user.email === email);
    // User is not found
    if (!user) throw new Error("Incorrect email or password!");

    // Check user password
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) throw new Error("Incorrect email or password!");
    // At this point user provided correct email and password.
    const payload = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
    };
    // Create the token.
    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "5d" });
    // Set token in http only cookie
    res.cookie("token", token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      expires: new Date(Date.now() + 3600000), // 5 valid for 5 days
    });
    return res.json({
      status: "success",
      message: "Login successful",
      user: payload,
    });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const signUpUser = async (req, res) => {
  const data = JSON.parse(req.body.data);
  const { fullName, email, password } = data;
  if (
    !fullName ||
    fullName.includes("@") ||
    fullName.includes(".") ||
    fullName.includes("#") ||
    fullName.includes("$") ||
    fullName.includes("*") ||
    fullName.includes("!") ||
    fullName.includes("&") ||
    fullName.includes("^")
  )
    return res
      .status(404)
      .json({ status: "failed", message: "Not a valid name!" });
  if (!email)
    return res
      .status(404)
      .json({ status: "failed", message: "Email can't be empty !" });
  if (!password)
    return res
      .status(404)
      .json({ status: "failed", message: "Password can't be empty !" });
  try {
    db.update();

    const user = db.users.find((user) => user.email === email);
    // Check if user is already registered or not.
    if (user)
      return res.status(404).json({
        status: "failed",
        message: "Email already exists. Kindly sign in",
      });

    // At this point user don't have the account so create one.
    // Hash the password and save the user in the database.
    const hashedPassword = await hashPassword(password);
    db.users.unshift({
      id: db.users.length,
      fullName,
      email,
      password: hashedPassword,
    });
    db.save();
    // User has been saved in the DB.
    return res.status(201).json({
      status: "success",
      message: `Your account has been created.`,
    });
  } catch (error) {
    if (typeof error === "string")
      return res.status(400).json({ status: "failed", message: error });
    if (typeof error === "object")
      return res.status(400).json({ status: "failed", message: error.message });
  }
};
const logoutUser = (_req, res) => {
  res.clearCookie("token");
  res.json({ status: "success" });
};
module.exports = {
  signInUser,
  signUpUser,
  logoutUser,
};
