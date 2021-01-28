const Drawing = require('../models/drawing.model.js');

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
    var drawing = new Drawing();
    drawing.userId = new mongoose.mongo.ObjectId(req._id);
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

module.exports.patchDrawing = async (req, res, next) => {
    // console.log(req.file);
    try {
        const drawing = await Drawing.findOne({_id: req.params.drawingId});
        console.log(drawing);
        console.log(res.body);
        drawing.content = req.body.content;
        await drawing.save();
        res.send(drawing);
    }
    catch(error) {
        console.error(error);
    }
}