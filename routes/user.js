// imporing dependencies
const router = require('express').Router();
const emailManager = require('../managers/email');
const userManager = require('../managers/user');
const { uuid } = require('uuidv4');
const path = require("path");
const fs = require("fs");
const crypto = require("../utils/crypto");

// login route
// a POST request for /users/login will be handled here
router.post('/login', async (req, res) => {
    try {
        // first check if the user exists
        let user = await userManager.getByEmail(req.body.email);
        if(!user)
            return res.status(400).send({
                user: null,
                message: `User does not exists with this email.`
            });

        const passwordMatches = await crypto.compare(req.body.password, user.password);
        if (!passwordMatches)
            return res.status(400).send({
                user: null,
                message: `Password did not match.`
            });
            
        if (user.active === false)
            return res.status(400).send({
                user: user,
                message: `User is not active. Please wait until the staff approves your request.`
            });

        return res.status(200).send(user);
    } catch (ex) {
        return res.status(500).send(ex.message);
    } 
});

// route for signup
router.post('/signup', async (req, res) => {
    try {
        // first check if the user with this email already exists
        let user = await userManager.getByEmail(req.body.email);
        if (user)
            return res.status(400).send(`User already exists with this email.`);

        const obj = {
            ...req.body,
            password: await crypto.hash(req.body.password)
        };

        // create new database user
        user = await userManager.create(obj);

        //send email
        await emailManager.sendEmail({
            to: req.body.email,
            subject: `Welcome to YLG`,
            html: `Hi ${user.name},<br/>
            Welcome to Your Local Gym (YLG). Your account signup request is received. Please wait for the staff to review your request and approve it. Then you can login and get the classes.
            <br/><br/>
            Regards,<br/>
            YLG Team.`
        });

        // return newly created user record with the response
        return res.status(200).send(user);
    } catch (ex) {
        // send errors in case of any exceptions
        return res.status(500).send(ex.message);
    }
});

// update password
router.post('/up/:id', async (req, res) => {
    try {
        let p = await crypto.hash(req.body.password);
        const t = await userManager.updatePassword(req.params.id, {password: p });
        return res.status(200).send(t);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

// update profile
router.post('/update', async (req, res) => {
    try {
        const userId = req.body._id;
        // if user has updated his profile picture
        if (req.files && req.files.file) {
            let targetFile = req.files.file;
            const ext = path.extname(targetFile.name);
            // create unique name for this file
            const key = `${uuid()}${ext}`;
            // save that file in "uploads" folder with a unique name
            targetFile.mv(path.join(__dirname, '../uploads', key), async err => {
                let data = {
                    ...req.body,
                    pictureId: key
                }
                // update user data
                const t = await userManager.updateProfile(userId, data);
                // return updated data to the response
                return res.status(200).send(t);
            });
        } else {
            // if there is no file attached
            // then no need to save it, rest of the process is same as above
            let user = await userManager.getById(userId);
            let data = {
                ...req.body,
                pictureId: user.pictureId
            }
            const t = await userManager.updateProfile(userId, data);
            return res.status(200).send(t);
        }
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

// get list of pending requests
router.post('/requests', async (req, res) => {
    try {
        const t = await userManager.getRequests();
        return res.status(200).send(t);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

// get a specific user by its ID
router.get('/approve/:id', async (req, res) => {
    try {
        const user = await userManager.approve(req.params.id);

        //send email
        await emailManager.sendEmail({
            to: user.email,
            subject: `YLG Account request accepted`,
            html: `Hi ${user.name},<br/>
            Welcome to Your Local Gym (YLG). Your account request is accepted by the staff, now you can login and get the classes.
            <br/><br/>
            Regards,<br/>
            YLG Team.`
        });

        return res.status(200).send(user);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

// delete a specific user by its ID
router.delete('/:id', async (req, res) => {
    try {
        const user = await userManager.deleteById(req.params.id);
        
        //send email
        await emailManager.sendEmail({
            to: user.email,
            subject: `YLG Account request declined`,
            html: `Hi ${user.name},<br/>
            This is to inform you that your account request is declined by the staff. You can apply again.
            <br/><br/>
            Regards,<br/>
            YLG Team.`
        });
        return res.status(200).send(user);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

module.exports = router;