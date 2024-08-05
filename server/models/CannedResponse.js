const mongoose = require("mongoose");
const responseSchema = new mongoose.Schema({
  categoryCannedResponse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CategoryCannedResponse",
  },
  cannedResponse: String,
});

module.exports = mongoose.model("CannedResponse", responseSchema);
