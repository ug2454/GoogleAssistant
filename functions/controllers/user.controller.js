const express = require("express");
const path = require("path");
const router = express.Router();

const User = require("../models/user");

const sgEmail = require("@sendgrid/mail");
sgEmail.setApiKey(
  "sendgrid_api_key"
);

router.get("/", (req, res) => {
  res.status(200);
  res.sendFile(path.join(__dirname, "../html", "index.html"));
});

router.post("/", (req, res) => {
  const { name, email, message } = req.body;
  console.log(name, email, message);
  const msg = {
    to: "u.garg14@gmail.com",
    from: `${email}`,
    subject: name,
    text: `${message}`,
  };

  sgEmail.send(msg).catch((err) => {
    console.log("failed send email", err);
  });
});

router.get("/background", (req, res) => {
  res.status(200);
  res.sendFile(path.join(__dirname, "../html", "background.html"));
});

router.post("/save", (req, res) => {
  const user = new User({
    painlevel: req.body.painlevel, //check this
  });

  user
    .save()
    .then(() => res.json("user successfull"))
    .catch((err) => res.json("error in post" + err));
});
module.exports = router;
