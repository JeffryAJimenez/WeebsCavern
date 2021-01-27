const mongoose = require("mongoose");

const CollectionSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  banner: [{ type: String }],

  tittle: { type: String },

  size: { type: Number },

  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
});

module.exports = mongoose.model("Collection", CollectionSchema);
