'use strict';

const mongoose = require('mongoose');
const router = require('express').Router();
const UserStats = mongoose.model('UserStats');

module.exports = router

.param('userId', (req, res, next, userId) => {
    UserStats.find({ user: userId })
    .populate('problems')
    .populate('comments')
    .then((userStats) => req.userStats = userStats)
    .then(() => next(), next);
})

.get('/:userId', ({ userStats }, res) => res.json(userStats))

.put('/:userId', ({ body, userStats }, res, next) => {
    userStats.set(body);
    userStats.save()
    .then((editedStats) => res.json(editedStats))
    .catch(next);
})

.delete('/:userId', ({ userStats }, res, next) => {
    UserStats.delete(userStats)
    .then(() => res.sendStatus(204))
    .catch(next);
})

.post('/', ({ body }, res, next) => {
    UserStats.create(body)
    .then((newUserStats) => res.json(newUserStats))
    .catch(next);
});
