const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: [2, 'Минимимальная длина поля name: 2'],
        maxlength: [30, 'Максимальная длина поля name: 30'],
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    users: {
        type: Array,
        default: [],
        items: {
            type: [mongoose.Schema.Types.ObjectId, 'Неккоректный _id пользователя'],
            ref: 'user',
        }
    }
});

module.exports = mongoose.model('room', roomSchema);
