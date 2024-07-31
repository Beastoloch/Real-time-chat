const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
    getRoomById, createRoom, getRooms, addUser, kickUser
} = require('../controllers/rooms');
const { regexURL } = require('../utility/constants');

router.get('/list/:userId', celebrate({
    params: Joi.object().keys({
        userId: Joi.string().hex().required(),
    }),
}), getRooms);
router.post('/create', celebrate({
    body: Joi.object().keys({
        name: Joi.string().min(2).max(30).required(),
        owner: Joi.string().hex().length(24).required(),
    }),
}), createRoom);
router.get('/:roomId', celebrate({
    params: Joi.object().keys({
        roomId: Joi.string().hex().required(),
    }),
}),getRoomById);
router.put('/:roomId/:userId', celebrate({
    params: Joi.object().keys({
        roomId: Joi.string().hex().length(24).required(),
        userId: Joi.string().hex().length(24).required(),
    }),
}), addUser);
router.delete('/:roomId/:userId', celebrate({
    params: Joi.object().keys({
        roomId: Joi.string().hex().length(24).required(),
        userId: Joi.string().hex().length(24).required(),
    }),
}), kickUser);

module.exports = router;
