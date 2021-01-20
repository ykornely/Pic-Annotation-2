require('./config/config');
require('./models/db');
require('./config/passportConfig');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');

const rtsIndex = require('./routes/index.router');

var app = express();

//middleware
// bodyparser is needed so we can pass json datas into this app. And because the Client and Server side runs on different port numbers.
app.use(bodyParser.json());
// this node.js app and the client-side app will be running in two different port numbers, 
// so to communicate between them, we need to add the cors package
app.use(cors());
// configuring middleware: when a user makes a request like /api/register it will be handled by the register function (user.controller.js)
app.use('/api', rtsIndex);
app.use(passport.initialize());

// error handler
app.use((err, req, res, next) => {
    if (err.name === 'ValidationError') {
        var valErrors = [];
        Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
        res.status(422).send(valErrors)
    }
});

// start express server
// we pass the port number with process.env.PORT
app.listen(process.env.PORT, () => console.log(`Server started at port: ${process.env.PORT}`));