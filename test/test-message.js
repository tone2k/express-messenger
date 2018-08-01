'use strict';
// global.DATABASE_URL = 'mongodb://localhost/express-messenger';
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config');

const {
    app,
    runServer,
    closeServer, 
    Message
} = require('../server');
const {
    User
} = require('../users');

const expect = chai.expect;

const username = 'newton@newton.com';
const firstName = 'Isaac';
const lastName = 'Newton';

const token = jwt.sign({
        user: {
            username,
            firstName,
            lastName
        }
    },
    JWT_SECRET, {
        algorithm: 'HS256',
        subject: username,
        expiresIn: '7d'
    }
);


chai.use(chaiHttp);

describe('/messages', function () {
            before(function () {
                return runServer();
            });

            after(function () {
                return closeServer();
            });

    it('should list Messages on GET', function () {
        return chai.request(app)
            .get('/messages')
            .set('authorization', `Bearer ${token}`)
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('array');
                const expectedKeys = ['name', 'message'];
                res.body.forEach(function (item) {
                    expect(item).to.be.a('object');
                    expect(item).to.include.keys(expectedKeys);
                });
            });
    });

    it('should add a message on POST', function () {
        const newMessage = {
            name: 'Jake',
            message: 'The Earth is our home',
        };
        return chai.request(app)
            .post('/messages')
            .set('authorization', `Bearer ${token}`)
            .send(newMessage)
            .then(function (res) {
                console.log(res.body);
                expect(res).to.have.status(201);
                expect(res).to.be.param;
                expect(res.body).to.be.a('object');
                expect(res.body).to.include.keys('_id', 'name', 'message');
                expect(res.body._id).to.not.equal(null);
            });
    });

// get post id and save for deleting. save as global variable to use in delete statement. 

    it('should delete message on DELETE', function () {
        let message;
        Message.findOne().then(
            _message => {
                message = _message;
                console.log("message", message)
            });
        return chai.request(app)
            .delete(`/messages/${message._id}`)
            .set('authorization', `Bearer ${token}`)
            .then(function (res) {
                expect(res).to.have.status(204);
            });
    });
});