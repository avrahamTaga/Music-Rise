const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let UserSchema = new Schema({
  fullName: { type: String, required: true },
  profileImageUrl: String,
  email: { type: String, required: true },
  password: { type: String, required: true },
  age: Number,
  adminStatus: Number,
  assets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
    },
  ],
  isArtist: Boolean,
  likedFiles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
    },
  ],
});

let User = mongoose.model("User", UserSchema);
module.exports = User;
