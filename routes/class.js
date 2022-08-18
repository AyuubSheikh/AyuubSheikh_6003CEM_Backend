// imporing dependencies
const router = require('express').Router();
const classManager = require('../managers/class');

// route for signup
router.post('/', async (req, res) => {
    try {
        // create new database classs
        let classs = await classManager.create(req.body);
        // return newly created classs record with the response
        return res.status(200).send(classs);
    } catch (ex) {
        // send errors in case of any exceptions
        return res.status(500).send(ex.message);
    }
});

// update
router.post('/update/:id', async (req, res) => {
    try {
        const classId = req.params.id;
        const t = await classManager.update(classId, req.body);
        return res.status(200).send(t);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

// get list of all the users
router.post('/find', async (req, res) => {
    try {
        const t = await classManager.list(req.body.keyword || '');
        return res.status(200).send(t);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

// delete a specific classs by its ID
router.delete('/:id', async (req, res) => {
    try {
        const t = await classManager.deleteById(req.params.id);
        return res.status(200).send(t);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

module.exports = router;