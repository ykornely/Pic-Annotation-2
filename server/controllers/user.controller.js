const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');

const User = require('../models/user.model.js');

// postman: request settings: POST, localhost:3000/api/register, Body > inputs

// function that handles user requests. Salt Secret is automatically created here.
module.exports.register = (req, res, next) => {
    var user = new User(); // new mongoose model User
    user.fullName = req.body.fullName;
    user.email = req.body.email.toLowerCase(); // TODO: testing
    user.password = req.body.password;
    user.save((err, doc) => {
        if (!err) {
            res.send(doc);
        } else {
            if (err.code == 11000) { // the code is 11000 in case of duplicate email addresses.
                res.status(422).send(['Duplicate email address found.']);
            } else {
                return next(err);
            }
        }
    });

    // console.log('Inside register function');
}

// when this authenticate function is called the arrow function in passportConfig.js is executed. From there the returned parameters are received here.
module.exports.authenticate = (req, res, next) => {
    // call for passport authentication (local strategy)
    passport.authenticate('local', (err, user, info) => {       
        // error from passport middleware
        if (err) return res.status(400).json(err);
        // registered user
        else if (user) return res.status(200).json({ "token": user.generateJwt() }); // generateJwt defined in user.model.js
        // unknown user or wrong password
        else return res.status(404).json(info);
    })(req, res);
}

module.exports.userProfile = (req, res, next) =>{
    User.findOne({ _id: req._id }, // mongoose function on userSchema
        (err, user) => {
            if (!user)
                return res.status(404).json({ status: false, message: 'User record not found.' });
            else
                return res.status(200).json({ status: true, user : _.pick(user,['fullName','email']) }); // we can use user in the front end part to get user details.
        }
    );
}