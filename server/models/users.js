const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: [2, 'Минимимальная длина поля name: 2'],
        maxlength: [30, 'Максимальная длина поля name: 30'],
        default: 'name',
    },
    password: {
        type: String,
        select: false,
        required: true,
        minlength: 8,
        maxLength: 64,
    },
});

userSchema.statics.findUserByCredentials = function (name, password) {
    return this.findOne({ name }).select('+password')
        .then((user) => {
            if (!user) {
                return Promise.reject(new Error('Неправильные логин или пароль'));
            }
            return bcrypt.compare(password, user.password)
                .then((matched) => {
                    if (!matched) {
                        return Promise.reject(new Error('Неправильные логин или пароль'));
                    }

                    return user;
                });
        });
};

module.exports = mongoose.model('user', userSchema);
