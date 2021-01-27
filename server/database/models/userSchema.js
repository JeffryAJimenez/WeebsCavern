const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },

    roles: {
      admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    },

    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
    },

    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
