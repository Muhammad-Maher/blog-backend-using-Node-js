const mongoose = require("mongoose");
const Post = require("./postsCollection");
const Schema = mongoose.Schema;

const schema = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: Post,
    required: true,
  },
});

const Comment = mongoose.model("Comment", schema);
module.exports = Comment;
