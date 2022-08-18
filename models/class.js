const mongoose = require("mongoose");

// user model with all its properties
const schema = new mongoose.Schema({
    title: { type: String, require: true },
    description: { type: String, require: true }
});

const Class = mongoose.model("Class", schema);

module.exports = Class;
