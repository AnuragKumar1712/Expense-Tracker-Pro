const mongoose = require("mongoose");
const emailManager = require("../../../managers/emailManager");

const forgotPassword = async (req, res) => {
  const usersModel = mongoose.model("users");

  const { email } = req.body;

  if (!email) throw "Email is required!";

  const getUser = await usersModel.findOne({
    email: email,
  });

  if (!getUser) throw "This email doesn't exist in the sysytem!";

  const resetCode = Math.floor(10000 + Math.random() * 90000);

  await usersModel.updateOne(
    {
      email: email,
    },
    {
      reset_code: resetCode,
    },
    {
      runValidators: true,
    }
  );

  await emailManager(
    email,
    "Your password reset code is " + resetCode,
    "Your password reset code is " + resetCode,
    "Reset Password - Expense Tracker PRO"
  );

  res.status(200).json({
    status: "Reset Code sent to email successfully!",
  });
};

module.exports = forgotPassword;
