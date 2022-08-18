const mongoose = require("mongoose");

// user model with all its properties
const schema = new mongoose.Schema({
    senderId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: { type: String, require: true, default: "" },
    date: { type: Date, require: true, default: Date.now()},
    status: {type: Boolean, required: true, default: false},
    reply: { type: String, require: false },
    dateReplied: { type: Date, require: false },
    repliedBy: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    }
});

const Message = mongoose.model("Message", schema);

module.exports = Message;
