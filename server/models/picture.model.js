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
    }
});

module.exports = mongoose.model('Picture', picSchema);