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

describe('Comment Route', function () {

    beforeEach('Establish DB connection', function (done) {
        if (mongoose.connection.db) return done();
        mongoose.connect(dbURI, done);
    });

    let comment1, comment2;

    beforeEach('Create a comment', function (done) {
        Comment.create({
            problem: '573616b14298a0a11598302e',
            user: '573616b14298a0a115983026',
            text: 'This is a comment.',
            upvotes: 20
        })
        .then(function (comment) {
            comment1 = comment;
        })
        .then(function () {
            done();
        }, done);
    });

    beforeEach('Create another comment', (done) => {
        Comment.create({
            problem: '573616b14298a0a11598302e',
            user: '573616b14298a0a115983027',
            text: 'This is another comment.',
            upvotes: 15
        })
        .then(function (comment) {
            comment2 = comment;
        })
        .then(function () {
            done();
        }, done);
    });

    afterEach('Clear test database', function (done) {
        clearDB(done);
    });

    describe('Logged in non-admin user', function () {

        let loggedInAgent;

        const userInfo = {
            username: 'Fake User',
            email: 'fakeuser@email.com',
            password: 'ebb'
        };

        beforeEach('Create a user', function (done) {
            User.create(userInfo, done);
        });

        beforeEach('Create loggedIn user agent and authenticate', function (done) {
            loggedInAgent = supertest.agent(app);
            loggedInAgent.post('/login').send(userInfo).end(done);
        });

        describe('GET by ProblemID', function () {
            it('displays all comments for a given problem', function (done) {
                loggedInAgent
                    .get(`/api/comments/problem/${comment1.problem}`)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .expect(function (res) {
                        expect(res.body).to.be.an.instanceOf(Array);
                        expect(res.body).to.have.length(2);
                    })
                    .end(done);
            });
        });

        describe('GET by UserID', function () {
            it('displays all comments for a given user', function (done) {
                loggedInAgent
                    .get(`/api/comments/user/${comment1.user}`)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .expect(function (res) {
                        expect(res.body).to.be.an.instanceOf(Array);
                        expect(res.body).to.have.length(1);
                    })
                    .end(done);
            });
        });

        describe('POST to /comments', function () {
            it('adds new comment', function (done) {
                loggedInAgent
                    .post('/api/comments')
                    .send({
                        problem: comment1.problem,
                        user: comment1.user,
                        text: 'This is a brand new comment.'
                    })
                    .expect(201)
                    .expect(function (res) {
                        expect(res.body.text).to.equal('This is a brand new comment.');
                        expect(res.body.upvotes).to.equal(0);
                        Comment.find({ problem: comment1.problem })
                        .then(function (response) {
                            expect(response).to.have.length(3);
                        });
                    })
                    .end(done);
            });
        });

        describe('Requests made by incorrect user', function () {

            describe('PUT by ID request made by incorrect user', function () {
                it('returns 403', function (done) {
                    loggedInAgent
                        .put(`/api/comments/${comment1._id}`)
                        .send({ text: 'Why can\'t I change this comment???' })
                        .expect(403)
                        .end(done);
                });
            });

            describe('DELETE by ID request made by incorrect user', function () {
                it('returns 403', function (done) {
                    loggedInAgent
                        .delete(`/api/comments/${comment1._id}`)
                        .expect(403)
                        .end(done);
                });
            });

        });

        describe('Requests made by correct user', function () {

            let newComment;

            beforeEach('Create a comment written by our logged-in user', function (done) {
                Comment.create({
                    problem: comment1.problem,
                    user: loggedInAgent._id,
                    text: 'Check out this comment!'
                })
                .then(function (comment) {
                    newComment = comment;
                })
                .then(function () {
                    done();
                }, done);
            });

            describe('PUT by ID request made by correct user', function () {
                it('edits comment', function (done) {
                    loggedInAgent
                        .put(`/api/comments/${newComment._id}`)
                        .send({ text: 'Changing my comment!' })
                        .expect(201)
                        .expect(function (res) {
                            expect(res.body.name).to.equal('Changing my comment!');
                        })
                        .end(done);
                });
            });

            describe('DELETE by ID request made by correct user', function () {
                it('deletes comment', function (done) {
                    loggedInAgent
                        .delete(`/api/comments/${newComment._id}`)
                        .expect(204)
                        .expect(function () {
                            Comment.find({ problem: comment1.problem })
                            .then(function (res) {
                                expect(res).to.have.length(2);
                            });
                        })
                        .end(done);
                });
            });

        });

    });

});
