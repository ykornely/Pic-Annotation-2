const { response } = require('express');
const mongoose = require('mongoose');
const sizeOf = require('buffer-image-size');

const Picture = require('../models/picture.model.js');
const { size } = require('lodash');

// postman: request settings: POST, localhost:3000/api/register, Body > inputs

module.exports.getPictures = (req, res, next) => {
    var pictures = Picture.find({userId: req._id}, {content: false}, (err, pictures) => {
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
    var dimensions = sizeOf(req.file.buffer);
    picture.userId = new mongoose.mongo.ObjectId(req._id);
    picture.content = req.file.buffer;
    picture.aspectRatio = dimensions.height / dimensions.width;
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

module.exports.downloadPicture = (req, res, next) => {
    Picture.findById(req.params.id, (err, picture) => {
        if (!err) {
            res.contentType('image/png');
            res.send(picture.content);
        } else {
            return next(err);
        }
    });
}