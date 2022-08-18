// import the Class model
const Class = require('../models/class');

// create object containing all methods related to Class model,
// so that we can call them from a single place
const Manager = {
    // method to get a Class by its ID
    getById: async id => {
        const t = await Class.findById(id);
        if (t === null)
            return false;

        return t;
    },
    // creating new classs in database
    create: async t => {
        let classs = new Class(t);
        const r = await classs.save();
        if (r === null)
            return false;

        return r;
    },
    // updating all profile values
    update: async (id, data) => {
        let t = await Class.findByIdAndUpdate(id, {
            title: data.title,
            description: data.description
        });
        return t ? t : false;
    },
    // get list of all users
    list: async keyword => {
        const t = await Class.aggregate([
            {
                $match: {
                    $or: [
                        {title: {$regex: keyword, $options: 'i'}},
                        {description: {$regex: keyword, $options: 'i'}}
                    ]
                }
            }]);

        if (t === null)
            return false;

        return t;
    },
    // delete a classs by its ID
    deleteById: async id => {
        const t = await Class.findByIdAndDelete(id);
        if (t === null)
            return false;

        return t;
    },
};

module.exports = Manager;