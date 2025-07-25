const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwtManager = require("../../../../handlers/managers/jwtManager");
const emailManager = require("../../../../handlers/managers/emailManager");

const register = async (req, res) => {
  const usersModel = mongoose.model("users");

  const { name, email, password, confirm_password, balance } = req.body;

  //Validations....
  if (!name) throw "Name is required!";
  if (!email) throw "Email must be provided!";
  if (!password) throw "Password must be provided!";
  if (password.length < 5) throw "Password must be atleast 5 characters long!";
  if (password !== confirm_password) throw "Confirm password doesn't match!";

  const getDuplicateEmail = await usersModel.findOne({
    email: email,
  });

  if (getDuplicateEmail) throw "This email already exist!";

  const hashedPassword = await bcrypt.hash(password, 12);

  const createdUser = await usersModel.create({
    name: name,
    email: email,
    password: hashedPassword,
    balance: balance,
  });

  const accessToken = jwtManager(createdUser);

  await emailManager(
    createdUser.email,
    "Welcome to expense tracker PRO. We hope you can manage your expenses easily from our platform!",
    "<h1>Welcome to expense tracker PRO.</h1><br/>We hope you can manage your expenses easily from our platform!",
    "Welcome to Expense Tracker PRO!"
  );

  res.status(201).json({
    status: "User registered successfully!",
    accessToken: accessToken,
  });
};

module.exports = register;
