const { redirect } = require("express/lib/response");
const jwt = require("jsonwebtoken");
const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  console.log(token);
  if (!token) {
    console.log("Token is not available ", token);
    return res.json({ message: "Unauthorised" });
  }

  try {
    console.log("token is available ");
    const user = jwt.verify(token, process.env.SECRET);
    console.log(user);
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Unauthorised." });
  }
};

module.exports = authenticate;
