'use strict';

const mongoose = require('mongoose');
const router = require('express').Router();
const Comment = mongoose.model('Comment');

module.exports = router

.get('/problem/:problemId', ({ params }, res, next) => {
    Comment.find({ problem: params.problemId })
    .populate('user')
    .then((commentsByProblem) => res.json(commentsByProblem))
    .catch(next);
})

.get('/user/:userId', ({ params }, res, next) => {
    Comment.find({ user: params.userId })
    .populate('problem')
    .then((commentsByUser) => res.json(commentsByUser))
    .catch(next);
})

.post('/', ({ body }, res, next) => {
    Comment.create(body)
    .then((newComment) => res.status(201).json(newComment))
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
    .then((editedComment) => res.status(201).json(editedComment))
    .catch(next);
})

// .put('/:id/upvote', (req, res, next) => {
//   Comment.findByIdAndUpdate(req.params.id, { $inc: { upvotes: 1 }}).exec();
// })

// .put('/:id/downvote', (req, res, next) => {
//   Comment.findByIdAndUpdate(req.params.id, { $inc: { upvotes: -1 }}).exec();
// })

.delete('/:id', ({ comment, user }, res, next) => {
    if (user._id !== comment.user) return next();
    Comment.remove(comment)
    .then(() => res.sendStatus(204))
    .catch(next);
});
