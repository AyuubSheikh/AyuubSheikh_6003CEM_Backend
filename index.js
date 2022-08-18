// importing all dependencies
require('./db-connection')();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const users = require('./routes/user');
const cors = require('cors');
const fileUpload = require('express-fileupload');

// setting up ExpressJS app
app.use(cors()); // CORS is to allow API to get requests from other apps
app.use(bodyParser.json()); // converting all incoming request data to JSON data because its easy to manipulate
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('uploads')); // setting up static folder to save profile pictures
app.use(fileUpload()); // calling file upload middleware, all incoming files will be available in req.files

// setting up routes for all entities
app.get('/', (req, res) => res.status(200).send("API is working..."));
app.use('/users', users);

// setting port for our API
const port = process.env.PORT || 4000;
// sapp.listen(port, () => console.log(`API started @${port}`));t, () => console.log(`A



//testing commit messagePI started @${port}`));