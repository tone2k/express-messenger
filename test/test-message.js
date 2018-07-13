'use strict';
global.DATABASE_URL = 'mongodb://localhost/express-messenger';
const chai = require('chai');
const chaiHttp = require('chai-http');

const {
    app,
    runServer,
    closeServer
} = require('../server');
const {
    User
} = require('../users');

const expect = chai.expect;

chai.use(chaiHttp);

describe('/messages', function () {
            before(function () {
                return runServer();
            });

            after(function () {
                return closeServer();
            });

            beforeEach(function () {});

            afterEach(function () {
                return message.remove({});})
});

it('should list Messages on GET', function () {
    return chai.request(app)
        .get('/messages')
        .then(function (res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.a('array');
            expect(res.body.length).to.be.at.least(1);
            const expectedKeys = ['id', 'name', 'message'];
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
        .post('/message')
        .send(newMessage)
        .then(function (res) {
            expect(res).to.have.status(201);
            expect(res).to.be.json;
            expect(res.body).to.be.a('object');
            expect(res.body).to.include.keys('id', 'name', 'message');
            expect(res.body.id).to.not.equal(null);
            expect(res.body).to.deep.equal(Object.assign(newMessage, {
                id: res.body.id
            }));
        });
});
