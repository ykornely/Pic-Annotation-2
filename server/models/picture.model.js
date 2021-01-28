const mongoose = require('mongoose');

const picSchema = new mongoose.Schema({
    content: {
        type: Buffer
    },
    userId: {
        type: mongoose.Types.ObjectId
    },
    description: {
        type: String
    },
    aspectRatio: {
        type: Number
    }
});

module.exports = mongoose.model('Picture', picSchema);