const Drawing = require('../models/drawing.model.js');
const mongoose = require('mongoose');

module.exports.getDrawings = (req, res, next) => {
    Drawing.find({userId: req._id, pictureId: req.params.pictureId}, (err, drawings) => {
        if (!err) {
            res.send(drawings);
        } else {
            return next(err);
        }
    });
}

module.exports.postDrawing = (req, res, next) => {
    // console.log(req.file);
    try {
        var drawing = new Drawing();
        drawing.userId = new mongoose.mongo.ObjectId(req._id);
        drawing.pictureId = req.params.pictureId;
        drawing.content = JSON.stringify({lines: []});
        drawing.description = "";
        drawing.save((err, drawing) => {
            console.log(err, drawing);
            if (!err) {
                res.send(drawing);
            } else {
                return next(err);
            }
        });
    } 
    catch(error) {
        console.log(error);
    }
}

module.exports.patchDrawing = async (req, res, next) => {
    // console.log(req.file);
    try {
        const drawing = await Drawing.findOne({_id: req.params.drawingId});
        drawing.content = req.body.content;
        drawing.description = req.body.description;
        await drawing.save();
        res.send(drawing);
    }
    catch(error) {
        console.error(error);
    }
}

module.exports.deleteDrawing = async (req, res, next) => {
    try {
        await Drawing.deleteOne({_id: req.params.drawingId});
        res.send("Success!");
    }
    catch(error) {
        console.error(error);
    }
}