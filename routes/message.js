// imporing dependencies
const router = require('express').Router();
const messageManager = require('../managers/message');
const emailManager = require('../managers/email');
const userManager = require('../managers/user');

// route for signup
router.post('/', async (req, res) => {
    try {
        // create new database message
        let message = await messageManager.create(req.body);
        // return newly created message record with the response
        return res.status(200).send(message);
    } catch (ex) {
        // send errors in case of any exceptions
        return res.status(500).send(ex.message);
    }
});

// route for signup
router.post('/reply', async (req, res) => {
    try {
        // create new database message
        let message = await messageManager.reply(req.body);
        let user = await userManager.getById(message.senderId);
        
        //send email
        await emailManager.sendEmail({
            to: user.email,
            subject: `YLG staff replied`,
            html: `Hi there,<br/>
            Thank you for reaching us about your inquiry. Following is our reply: <br/>
            &quot;${message.reply}&quot;
            <br/><br/>
            Your message was: <br/> &quot;${message.message}&quot;
            <br/><br/>
            Regards,<br/>
            YLG Team.`
        });

        // return newly created message record with the response
        return res.status(200).send(message);
    } catch (ex) {
        // send errors in case of any exceptions
        return res.status(500).send(ex.message);
    }
});

// get list of all the users
router.get('/', async (req, res) => {
    try {
        const t = await messageManager.list();
        return res.status(200).send(t);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

// get list of all the users
router.get('/history', async (req, res) => {
    try {
        const t = await messageManager.history();
        return res.status(200).send(t);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

module.exports = router;