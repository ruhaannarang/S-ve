const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },

  caption: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    required: true,
  },

  likes: {
    type: [String],   // stores userIds
    default: []
  }

}, { timestamps: true });

module.exports = mongoose.model("Posts", postSchema);