const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    username: String,
    message: {
      type: String,
      required: [true, "Message cannot be empty"],
    },
    room: String,
    sender: String,
    status: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
