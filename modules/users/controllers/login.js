const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwtManager = require("../../../managers/jwtManager");

const login = async (req, res) => {
  const usersModel = mongoose.model("users");

  const { email, password } = req.body;

  const getUser = await usersModel.findOne({
    email: email,
  });

  if (!getUser) throw "This email doesn't exist in the system!";

  const comparePassword = await bcrypt.compare(password, getUser.password);

  if (!comparePassword) throw "Email and Password do not match!";

  const accessToken = jwtManager(getUser);

  // Success response
  res.status(200).json({
    status: "Success!",
    message: "User logged in successfull!",
    accessToken: accessToken,
  });
};

module.exports = login;
