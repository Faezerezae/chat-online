const mongoose = require("mongoose");
const categoryCannedResponseSchema = new mongoose.Schema({
  name: { type: String, unique: true },
});

module.exports = mongoose.model(
  "CategoryCannedResponse",
  categoryCannedResponseSchema
);
