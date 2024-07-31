const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Message = require('../models/messages');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const ConflictError = require('../errors/conflict-error');

module.exports.getMessages = (req, res, next) => {
    Message.find({})
        .then((messages) => {
            res.send({ data: messages });
        })
        .catch((err) => next(err));
};

// module.exports.createMessage = (req, res, next) => {
//     const { text, roomId } = req.body;
//     const owner = req.user._id;
//
//     Room.create({ text, roomId, owner })
//         .then((message) => res.send({ data: message }))
//         .catch((err) => {
//             if (err.name === 'ValidationError') {
//                 next(new BadRequestError('Некорректные данные'));
//             } else {
//                 next(err);
//             }
//         });
// };