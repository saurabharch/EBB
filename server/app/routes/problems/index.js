'use strict';

var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');
var Problem = mongoose.model('Problem');

router.get('/', function(req, res, next) {
    Problem.find({}).exec()
    .then(function(problems) {
        res.json(problems);
    })
    .catch(next);
});

router.get('/:id', ({ params }, res, next) => {
    Problem.findById(params.id)
    .then((problem) => res.json(problem))
    .catch(next);
});

router.post('/', function(req, res, next) {
  console.log('req.body in router.post', req.body)
    Problem.create(req.body)
    .then(function(problem) {
        console.log('problem in router.post', problem)
        res.status(201).json(problem);
    })
    .catch(next);
});
