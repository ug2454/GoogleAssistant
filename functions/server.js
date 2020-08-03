const express = require("express");
const connectDB = require("./config/database");
const bodyParser = require("body-parser");

/*ENVIRONMENT VARIABLES*/
require("dotenv").config({
  path: "./config/config.env",
});

const app = express();
//including static files
app.use(express.static("html"));
// app.use(express.static("css"));
// app.use(express.static("images"));

/*CONNECTION TO DB*/
connectDB();

/*BODY PARSER MIDDLEWARE*/

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/*SERVER PORT*/

const PORT = process.env.PORT || 4200;

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

/* ADDING CONTROLLERS*/
const user_controller = require("./controllers/user.controller");
app.use("/", user_controller);
