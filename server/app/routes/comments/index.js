'use strict';

import mongoose from 'mongoose';
import express from 'express';
const router = express.Router();
const Comment = mongoose.model('Comment');
module.exports = router;

router.get('/problem/:problemId', ({ params }, res, next) => {
    Comment.find({ problem: params.problemId })
    .then((commentsByProblem) => res.json(commentsByProblem))
    .catch(next);
});

router.get('/user/:userId', ({ params }, res, next) => {
    Comment.find({ user: params.userId })
    .then((commentsByUser) => res.json(commentsByUser))
    .catch(next);
});

router.post('/', ({ body }, res, next) => {
    Comment.create(body)
    .then((newComment) => res.json(newComment))
    .catch(next);
});

router.put('/:id', ({ body, params }, res, next) => {
    Comment.find({ _id: params.id })
    .then((comment) => comment.set(body))
    .then((editedComment) => editedComment.save())
    .then((savedComment) => res.json(savedComment))
    .catch(next);
});

router.delete('/:id', ({ params }, res, next) => {
    Comment.remove({ _id: params.id })
    .then(() => res.sendStatus(204))
    .catch(next);
});
