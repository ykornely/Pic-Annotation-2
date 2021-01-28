const mongoose = require('mongoose');

const drawingSchema = new mongoose.Schema({
    content: {
        type: String
    },
    pictureId: {
        type: mongoose.Types.ObjectId
    },
    userId: {
        type: mongoose.Types.ObjectId
    },
    description: {
        type: String
    }
});

module.exports = mongoose.model('Drawing', drawingSchema);