const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const ConflictError = require('../errors/conflict-error');
const {
    SUCCESS_AUTH_CODE,
} = require('../utility/constants');
const { NODE_ENV, JWT_SECRET } = process.env;

    module.exports.getUsersById = (req, res, next) => {
        User.findById(req.params.userId)
            .then((user) => {
                if (!user) {
                    next(new NotFoundError('Пользователь не найден'));
                    return;
                }
                res.send({data: user});
            })
            .catch((err) => {
                if (err.name === 'CastError') {
                    next(new BadRequestError('Неккоректный _id пользователя'));
                } else {
                    next(err);
                }
            });
    };

    module.exports.getUsers = (req, res, next) => {
        console.log(req.body.users);
        User.find({_id : {$in : req.body.users}})
            .then((users) => {
                const names = users.map((u) => ({name: u.name, _id: u._id}));
                res.send({names});
            })
            .catch((err) => {
                next(err);
            });
    };

    module.exports.getCurrentUser = (req, res, next) => {
        User.findById(req.user)
            .then((user) => {
                res.send({ data: {
                        name: user.name,
                        _id: user._id
                    } });
            })
            .catch((err) => {
                next(err);
            });
    };

    module.exports.createUser = (req, res, next) => {
        const {
            password, name
        } = req.body;

        bcrypt.hash(password, 10)
            .then((hash) => User.create({password: hash, name})
                .then((user) => {
                    res.status(SUCCESS_AUTH_CODE).send({
                        name: user.name,
                        _id: user._id,
                    });
                })
                .catch((err) => {
                    if (err.name === 'ValidationError') {
                        console.log(err);
                        next(new BadRequestError('Некорректные данные'));
                        return;
                    }
                    if (err.code === 11000) {
                        next(new ConflictError('Этот email уже зарегистрирован'));
                        return;
                    }
                    next(err);
                }));
    };

    module.exports.login = (req, res, next) => {
        const { name, password } = req.body;

        return User.findUserByCredentials(name, password)
            .then((user) => {
                res.send({
                    token: jwt.sign(
                        { _id: user._id },
                        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
                        { expiresIn: '7d' },
                    ),
                });
            })
            .catch((err) => {
                if (err.message === 'Неправильные почта или пароль') {
                    next(new UnauthorizedError('Неправильные почта или пароль'));
                } else {
                    next(err);
                }
            });
    };