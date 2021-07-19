const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let FileSchema = new Schema({
  fileTitle: { type: String, required: true },
  fileLink: { type: String, required: true },
  description: String,
  FileSize: Number,
  isDownloadAble: Boolean,
  downloads: { type: Number, default: 0 },
  shares: { type: Number, default: 0 },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  likes: { type: Number, default: 0 },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

let File = mongoose.model("File", FileSchema);
module.exports = File;
