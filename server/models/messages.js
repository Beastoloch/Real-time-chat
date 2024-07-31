const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    text: {
        type: String,
        minlength: [1, 'Минимимальная длина поля name: 2'],
        maxlength: [300, 'Максимальная длина поля name: 30'],
        default: 'text'
    },
    owner: {
        type: String,
        minlength: [2, 'Минимимальная длина поля name: 2'],
        maxlength: [30, 'Максимальная длина поля name: 30'],
        required: true
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'room',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('message', messageSchema);
