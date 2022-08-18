require('dotenv').config();
const mongoose = require('mongoose');
const userManager = require('./managers/user');
const User = require('./models/user');
const crypto = require('./utils/crypto');

const staff = [
    {
        name: "Admin 1",
        email: "admin1@gmail.com",
        type: 1,
        active: true,
    },
    {
        name: "Admin 2",
        email: "admin2@gmail.com",
        type: 1,
        active: true,
    },
    {
        name: "Admin 3",
        email: "admin3@gmail.com",
        type: 1,
        active: true,
    }
];

mongoose.connect(process.env.DB_CONNECTION_STRING, {
    useCreateIndex: true,
    useNewUrlParser: true,
    poolSize: 5,
    useUnifiedTopology: true
})
    .then(db => console.log('Connected with MongoDB for Seeding.'))
    .catch(err => console.log(`Unable to connect with MongoDB: ${err.message}`));

const saveAdmins = () => new Promise(async (resolve, reject) => {
    await User.deleteMany({});
    let password = await crypto.hash("admin");
    for(let i=0; i < staff.length; i++) {
        let t = staff[i];
        await userManager.create({
            ...t,
            password: password
        });
    }
    resolve();
});

(async () => {
    await saveAdmins();
    console.log('Seeding completed.\nDisconnecting Seeder.');
    mongoose.disconnect();
})();