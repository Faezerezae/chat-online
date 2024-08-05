const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "support" },
  avatar: { type: String, default: "" },
  read: { type: Boolean, default: false },
  status: { type: String, default: "status-offline" },
  ip: { type: String, required: false },
  location: { type: String, required: false },
  os: { type: String, required: false },
  browser: { type: String, required: false },
  device: { type: String, required: false },
  cpu: { type: String, required: false },
  currentPath: { type: String, required: false },
  currentTitle: { type: String, required: false },
  lastDisconnect: { type: Date, required: false },
  onlineDuration: { type: Number, required: false, default: 0 },
  currentReferrer: { type: String, required: false },
  visitHistory: [
    {
      path: String,
      title: String,
    },
  ],
  onlineDurations: [
    {
      path: String,
      duration: Number,
      visitDate: Date,
      referrer: String,
    },
  ],
  blocked: { type: String, default: "false" }
});

module.exports = mongoose.model("User", UserSchema);
