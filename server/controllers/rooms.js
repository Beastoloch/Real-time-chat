const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Room = require('../models/rooms');
const User = require('../models/users');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const ConflictError = require('../errors/conflict-error');

module.exports.getRooms = (req, res, next) => {
    const userId = req.params.userId;
    Room.find({})
        .then((room) => {
            const names = room.map((r) =>
                ({
                    _id: r._id,
                    name: r.name,
                    isGoing: r.users.includes(userId),
                }));
            res.send({ data: names });
        })
        .catch((err) => next(err));
};

module.exports.getRoomById = async (req, res, next) => {
    Room.findById(req.params.roomId)
        .then((room) => {
            if (!room) {
                next(new NotFoundError('Комната не найдена'));
                return;
            }
            res.send({ data: room});
        })
        .catch((err) => {
            if (err.name === 'CastError') {
                next(new BadRequestError('Неккоректный _id комнаты'));
            } else {
                next(err);
            }
        });
};

module.exports.createRoom = (req, res, next) => {
    const users = [];
    const { name } = req.body;
    const owner = req.user._id;
    users.push(owner);

    Room.create({ name, owner, users })
        .then((room) => res.send({ data: room }))
        .catch((err) => {
            if (err.name === 'ValidationError') {
                next(new BadRequestError('Некорректные данные'));
            } else {
                next(err);
            }
        });
};

module.exports.addUser = (req, res, next) => {
    Room.findByIdAndUpdate(
        req.params.roomId, {$addToSet: {users: req.params.userId}}, {new: true},
    )
        .then((room) => {
            if (!room) {
                next(new NotFoundError('Комната не найдена'));
                return;
            }
            res.send({data: room});
        })
        .catch((err) => {
            if (err.name === 'CastError') {
                next(new BadRequestError('Неккоректный _id комнаты'));
            } else {
                next(err);
            }
        });
}

module.exports.kickUser = (req, res, next) => {
    Room.findByIdAndUpdate(
        req.params.roomId,
        {$pull: {users: req.params.userId}},
        {new: true},
    )
        .then((room) => {
            if (!room) {
                next(new NotFoundError('Комната не найдена'));
                return;
            }
            res.send({data: room});
        })
        .catch((err) => {
            if (err.name === 'CastError') {
                next(new BadRequestError('Неккоректный _id комнаты'));
            } else {
                next(err);
            }
        });
}