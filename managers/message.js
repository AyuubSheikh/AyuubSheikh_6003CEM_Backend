const Message = require('../models/message');

const Manager = {
    create: async t => {
        let message = new Message(t);
        message = await message.save();
        return message ? message : false;
    },
    list: async () => {
        let t = await Message.find({
            status: false
        }).populate('senderId');
        return t ? t : false;
    },
    history: async () => {
        let t = await Message.find({}).populate('senderId').populate('repliedBy');
        return t ? t : false;
    },
    reply: async data => {
        let t = await Message.findByIdAndUpdate(data.messageId, {
            status: true,
            reply: data.reply,
            dateReplied: data.dateReplied,
            repliedBy: data.repliedBy
        }, {
            new: true
        });
        return t ? t : false;
    },
    getBySenderId: async senderId => {
        let t = await Message.find({
            senderId: senderId
        });
        return t ? t : false;
    },
    getById: async id => {
        let t = await Message.findById(id);
        return t ? t : false;
    }
};

module.exports = Manager;