require('dotenv').config();
const ws = require('ws');
const Message = require('./models/messages');
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const { errors, celebrate, Joi } = require('celebrate');
const NotFoundError = require('./errors/not-found-error');
const centreErrors = require('./middlewares/errors');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const {login, createUser} = require("./controllers/users");
const {
    allowedCors,
    DEFAULT_ALLOWED_METHODS,
    regexURL,
} = require('./utility/constants');

const { PORT = 5001 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 400,
});

mongoose.connect('mongodb://localhost:27017/real-time-chat', {
    useNewUrlParser: true,
});

app.use(helmet());
app.use(limiter);

app.use((req, res, next) => {
    const { origin } = req.headers;
    const { method } = req;
    const requestHeaders = req.headers['access-control-request-headers'];

    if (allowedCors.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }

    if (method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
        res.header('Access-Control-Allow-Headers', requestHeaders);
        return res.end();
    }

    next();
    return null;
});

const wss = new ws.Server({
    port: 5000,
}, () => console.log(`Server started on 5000`))


wss.on('connection', function connection(ws) {
    ws.on('message', function (message) {
        message = JSON.parse(message)
        switch (message.event) {
            case 'message':
                broadcastMessage(message)
                break;
            case 'connection':
                broadcastMessage(message);
                break;
        }
    })
})

function broadcastMessage(message, id) {
    wss.clients.forEach(client => {
        Message.create({text: message.text, owner: message.owner, roomId: message.roomId})

            .then((data) => {});
        client.send(JSON.stringify(message));
    })
}

app.post('/signin', celebrate({
    body: Joi.object().keys({
        name: Joi.string().required().min(2).max(30),
        password: Joi.string().required(),
    }),
}), login);

app.post('/signup', celebrate({
    body: Joi.object().keys({
        name: Joi.string().required(),
        password: Joi.string().required(),
    }),
}), createUser);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/rooms', require('./routes/rooms'));
app.use('/messages', require('./routes/messages'));

app.use((req, res, next) => {
    next(new NotFoundError('Неверный путь'));
});

app.use(errorLogger);

app.use(errors());
app.use(centreErrors);

app.listen(PORT, () => {
    console.log(`Сервер работает на порте ${PORT}`);
});

