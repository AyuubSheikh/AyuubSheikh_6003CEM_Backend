// import the User model
const User = require('../models/user');

// create object containing all methods related to User model,
// so that we can call them from a single place
const Manager = {
    // method to get a User by its ID
    getById: async id => {
        const t = await User.findById(id);
        if (t === null)
            return false;

        return t;
    },
    // method to get a User by its email
    getByEmail: async email => {
        const t = await User.findOne({ email: email });
        if (t === null)
            return false;

        return t;
    },
    // creating new user in database
    create: async t => {
        let user = new User(t);
        const r = await user.save();
        if (r === null)
            return false;

        return r;
    },
    // updating password
    updatePassword: async (id, data) => {
        let t = await User.findByIdAndUpdate(id, {
            password: data.password
        });
        return t ? t : false;
    },
    // updating password
    approve: async id => {
        let t = await User.findByIdAndUpdate(id, {
            active: true
        }, {
            new: true
        });
        return t ? t : false;
    },
    // updating all profile values
    updateProfile: async (id, data) => {
        let t = await User.findByIdAndUpdate(id, {
            name: data.name,
            address: data.address,
            goal: data.goal,
            experienced: data.experienced,
            pictureId: data.pictureId,
            history: data.history,
            paymentNumber: data.paymentNumber,
            paymentTitle: data.paymentTitle,
            paymentCvv: data.paymentCvv
        }, {
            new: true
        });
        return t ? t : false;
    },
    // get list of all users
    list: async keyword => {
        const t = await User.aggregate([
            {
                $match: {
                    $or: [
                        {name: {$regex: keyword, $options: 'i'}},
                        {email: {$regex: keyword, $options: 'i'}}
                    ]
                }
            }]);

        if (t === null)
            return false;

        return t;
    },
    // get list of all users
    getRequests: async () => {
        const t = await User.find({
            type: 2,
            active: false
        });

        if (t === null)
            return false;

        return t;
    },
    // delete a user by its ID
    deleteById: async id => {
        const t = await User.findByIdAndDelete(id);
        if (t === null)
            return false;

        return t;
    },
};

module.exports = Manager;