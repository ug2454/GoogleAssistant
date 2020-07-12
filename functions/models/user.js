const mongoose = require("mongoose");

var userSchema = new mongoose.Schema(
  {
    painlevel: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("painlevels", userSchema);
module.exports = User;
