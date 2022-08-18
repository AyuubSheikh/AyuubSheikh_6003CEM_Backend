const mongoose = require("mongoose");

// user model with all its properties
const schema = new mongoose.Schema({
    name: { type: String, require: true },
    address: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    goal: { type: String, require: false },
    experienced: { type: String, require: false },
    active: { type: Boolean, require: true, default: false },
    history: { type: String, require: false },
    pictureId: { type: String, require: false },
    type: { type: Number, require: true },
    paymentNumber: { type: String, require: false },
    paymentTitle: { type: String, require: false },
    paymentCvv: { type: String, require: false },
});

const User = mongoose.model("User", schema);

module.exports = User;
