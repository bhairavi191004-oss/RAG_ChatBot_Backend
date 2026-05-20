const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  fileName: String,
  text: String,
  chunkIndex: Number,
  embedding: [Number],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("File", fileSchema);