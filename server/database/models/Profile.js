const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  collectionsSize: { type: Number },

  collections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Collection" }],

  postSize: { type: Number },

  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
});

module.exports = mongoose.model("Profile", profileSchema);
