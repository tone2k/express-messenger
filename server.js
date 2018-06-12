'use strict';
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app)
const io = require('socket.io')(http)


const { router: usersRouter } = require('./users');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');


mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require('./config');

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}));

// Logging
app.use(morgan('common'));

app.use(express.static('public'));

// CORS
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    if (req.method === 'OPTIONS') {
        return res.send(204);
    }
    next();
});

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);

const jwtAuth = passport.authenticate('jwt', { session: false });

// A protected endpoint which needs a valid JWT to access it
app.get('/api/protected', jwtAuth, (req, res) => {
    return res.json({
        data: 'rosebud'
    });
});

const Message = mongoose.model('Message', {
    name: String,
    message: String
})

app.get('/messages', (req, res) => {
    Message.find()
    .then(messages =>{
        res.status(200).json(messages)
    })
});

app.get('/messages:user', (req, res) => {
    const user = req.params.user
    Message.find({
        name: user
    }, (err, messages) => {
        res.send(messages)
    })
})



app.post('/messages', async (req, res) => {

    try {
        const message = new Message(req.body)

        const savedMessage = await message.save()

        console.log('saved')

        const censored = await Message.findOne({
            message: 'badword'
        })
        if (censored)
            await message.remove({
                _id: censored.id
            })
        else
            io.emit('message', req.body)

        res.sendStatus(200)
    } catch (error) {
        res.sendStatus(500)
        return console.error(error)
    } finally {

    }
})

app.delete('/messages/:id', (req, res) => {
    console.log(`Deleting message post with id \`${req.params.id}\``);
    Message.findByIdAndRemove(req.params.id)
    .then(() =>{
        io.emit('delete');
        res.status(204).end()
    });
});

app.use('*', (req, res) => {
    return res.status(404).json({
        message: 'Not Found'
    });
});


io.on('connection', (socket) => {
    console.log('user connected!')
})

// Referenced by both runServer and closeServer. closeServer
// assumes runServer has run and set `server` to a server object
let server;

function runServer() {
    return new Promise((resolve, reject) => {
        mongoose.connect(DATABASE_URL, { useMongoClient: true }, err => {
            if (err) {
                return reject(err);
            }
            server = http
                .listen(PORT, () => {
                    console.log(`Your app is listening on port ${PORT}`);
                    resolve();
                })
                .on('error', err => {
                    mongoose.disconnect();
                    reject(err);
                });
        });
    });
}

function closeServer() {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            console.log('Closing server');
            server.close(err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });
}

if (require.main === module) {
    runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
