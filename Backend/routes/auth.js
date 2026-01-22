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
router.get("/", (req, res) => {
  res.send();
});

module.exports = router;
