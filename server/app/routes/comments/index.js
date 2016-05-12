'use strict';

import mongoose from 'mongoose';
import express from 'express';
const router = express.Router();
const Comment = mongoose.model('Comment');

module.exports = router

.get('/problem/:problemId', ({ params }, res, next) => {
    Comment.find({ problem: params.problemId })
    .then((commentsByProblem) => res.json(commentsByProblem))
    .catch(next);
})

.get('/user/:userId', ({ params }, res, next) => {
    Comment.find({ user: params.userId })
    .then((commentsByUser) => res.json(commentsByUser))
    .catch(next);
})

.post('/', ({ body }, res, next) => {
    Comment.create(body)
    .then((newComment) => res.json(newComment))
    .catch(next);
})

.param('id', (req, res, next, id) => {
    Comment.findById(id)
    .then((comment) => req.comment = comment)
    .then(() => next(), next);
})

.put('/:id', ({ body, comment, user }, res, next) => {
    if (user._id !== comment.user) return next();
    comment.set(body);
    comment.save()
    .then((editedComment) => res.json(editedComment))
    .catch(next);
})

.delete('/:id', ({ comment, user }, res, next) => {
    if (user._id !== comment.user) return next();
    Comment.remove(comment)
    .then(() => res.sendStatus(204))
    .catch(next);
});
