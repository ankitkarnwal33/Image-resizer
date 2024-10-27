const bcrypt = require("bcrypt");
let pass = "";
const hashPassword = async (plainPassword) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    return hashedPassword;
  } catch (err) {
    return err;
  }
};

const verifyPassword = async (plainPassword, hashedPassword) => {
  try {
    const isValid = await bcrypt.compare(plainPassword, hashedPassword);
    return isValid;
  } catch (err) {
    return err;
  }
};

module.exports = {
  hashPassword,
  verifyPassword,
};
