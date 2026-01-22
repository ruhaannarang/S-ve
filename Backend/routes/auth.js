const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
// const cors = require("cors");
var jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
// const expressjson = require("express.json");
const User = require("../models/User");
// app.use(cors());
const JWT_SECRET = process.env.JWT_SECRET;
var fetchuser = require("../middleware/fetchuser");
//creating user

router.post("/createuser", async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res
      .status(400)
      .json({ error: "Sorry a user with this email already exists" });
  }
  const salt = await bcrypt.genSalt(10);
  const secPass = await bcrypt.hash(req.body.password, salt);
  user = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: secPass,
  });
  const data = {
    user: {
      id: user.id,
    },
  };
  const authtoken = jwt.sign(data, JWT_SECRET);
  res.json({ success: true, authtoken });
});

//login user

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  let user = await User.findOne({ username: username });
  if (!user) {
    return res
      .status(400)
      .json({ error: "Sorry a user with this username does not exist" });
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    return res
      .status(400)
      .json({ error: "Sorry a user with this username and password does not exist" });
  }
  const data = {
    user: {
      id: user.id,
    },
  };
  const authtoken = jwt.sign(data, JWT_SECRET);
  res.json({ success: true, authtoken });
});

//getuser details

router.get("/getuser", fetchuser, async (req, res) => {
  const userId = req.user.id;
  let user = await User.findOne({ _id: userId }).select("-password");
  if (!user) {
    return res
      .status(400)
      .json({ error: "Sorry a user with this username does not exist" });
  }
  res.json({ success: true, user });
});

router.get("/", (req, res) => {
  res.send();
});

module.exports = router;
