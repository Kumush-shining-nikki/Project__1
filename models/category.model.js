const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  category: {
    type: String, 
    enum: ["Sport", "Texnologiya", "O'zbekiston", "Jahon"],
    required: true,
    unique: true
  }
});

const categoryModel = mongoose.model("Category", categorySchema);
module.exports = categoryModel;
