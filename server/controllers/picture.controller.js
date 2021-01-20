const { response } = require('express');
const mongoose = require('mongoose');

const Picture = require('../models/picture.model.js');

// postman: request settings: POST, localhost:3000/api/register, Body > inputs

module.exports.getPictures = (req, res, next) => {
    var pictures = Picture.find({userId: req._id}, (err, pictures) => {
        if (!err) {
            res.send(pictures);
        } else {
            return next(err);
        }
    });
}

module.exports.postPicture = (req, res, next) => {
    // console.log(req.file);
    var picture = new Picture();
    picture.userId = new mongoose.mongo.ObjectId(req._id);
    picture.content = req.file.buffer;
    picture.description = "";
    picture.save((err, picture) => {
        console.log(err, picture);
        if (!err) {
            res.send(picture);
        } else {
            return next(err);
        }
    });
}