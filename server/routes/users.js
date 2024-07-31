const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getUsersById, getCurrentUser, getUsers} = require('../controllers/users');


router.get('/me', getCurrentUser);
router.get('/:userId', celebrate({
    params: Joi.object().keys({
        userId: Joi.string().hex().length(24).required(),
    }),
}), getUsersById);
router.post('/getUsers/users', celebrate({
    body: Joi.object().keys({
        users: Joi.array()
    }),
}), getUsers);

module.exports = router;
