const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.get("/", async (req, res) => {
  const userList = await User.find().select("-passwordHash");
  if (!userList) {
    res.status(500).json({ success: false });
  }
  res.send(userList);
});

router.post("/", async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    apartment: req.body.apartment,
    street: req.body.street,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });
  user = await user.save();
  if (!user) {
    return res.status(404).send("the user cant be saved");
  }
  res.send(user);
});

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("-passwordHash");
  if (!user) {
    res.status(500).json({
      message: "The user with the given id is nof found",
    });
  }
  res.status(200).send(user);
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
  });
  const secret = process.env.secret;
  if (!user) {
    res.status(400).send("The User not found");
  }
  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user.id,
      },
      secret,
      { expiresIn: "1w" }
    );
    res.status(200).send({ user: user.email, token: token });
  } else res.status(400).send("Incorrect password");
});

module.exports = router;
