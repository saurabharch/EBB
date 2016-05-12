'use strict';

import mongoose from 'mongoose';
import express from 'express';
const router = express.Router();
const UserStats = mongoose.model('UserStats');

module.exports = router

.get('/', (req, res, next) => {
    UserStats.find({})
    .then((stats) => res.json(stats))
    .catch(next);
})

.param('id', (req, res, next, id) => {
    UserStats.findById(id)
    .then((stats) => req.stats = stats)
    .then(() => next(), next);
})

.get('/:id', ({ stats }, res) => res.json(stats))

.post('/', ({ body }, res, next) => {
    UserStats.create(body)
    .then((stats) => res.json(stats))
    .catch(next);
})

.put('/:id', ({ stats, body }, res, next) => {
    stats.set(body);
    stats.save()
    .then((newStats) => res.json(newStats))
    .catch(next);
})

.delete('/:id', ({ stats }, res, next) => {
    UserStats.remove(stats)
    .then(() => res.sendStatus(204))
    .catch(next);
});
