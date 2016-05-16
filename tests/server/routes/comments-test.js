'use strict';

const mongoose = require('mongoose');
require('../../../server/db/models');
const Comment = mongoose.model('Comment');
const User = mongoose.model('User');

const expect = require('chai').expect;

const dbURI = 'mongodb://localhost:27017/testingDB';
const clearDB = require('mocha-mongoose')(dbURI);

const supertest = require('supertest');
const app = require('../../../server/app');

describe('Comment route', () => {

    beforeEach('Establish DB connection', (done) => {
        if (mongoose.connection.db) return done();
        mongoose.connect(dbURI, done);
    });

    let comment1, comment2;

    beforeEach('Create a comment', (done) => {
        Comment.create({
            problem: ObjectId("573616b14298a0a11598302e"),
            user: ObjectId("573616b14298a0a115983026"),
            text: 'This is a comment.',
            upvotes: 20
        })
        .then((comment) => comment1 = comment)
        .then(() => done(), done);
    });

    beforeEach('Create another comment', (done) => {
        Comment.create({
            problem: ObjectId("573616b14298a0a11598302e"),
            user: ObjectId("573616b14298a0a115983027"),
            text: 'This is another comment.',
            upvotes: 15
        })
        .then((comment) => comment2 = comment)
        .then(() => done(), done);
    });

    afterEach('Clear test database', (done) => {
        clearDB(done);
    });

    describe('Logged in non-admin user', () => {

        let loggedInAgent;

        const userInfo = {
            username: 'Fake User',
            email: 'fakeuser@email.com',
            password: 'ebb'
        };

        beforeEach('Create a user', (done) => {
            User.create(userInfo, done);
        });

        beforeEach('Create loggedIn user agent and authenticate', (done) => {
            loggedInAgent = supertest.agent(app);
            loggedInAgent.post('/login').send(userInfo).end(done);
        });



    });
});
