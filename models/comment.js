const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let commentSchema = new Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  body: { type: String, required: true },
  craetedat: { type: Date, default: Date.now() },
});

let Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
