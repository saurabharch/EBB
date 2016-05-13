'use strict';
const router = require('express').Router();
module.exports = router;
const mongoose = require('mongoose');
const User = mongoose.model('User');
// const _ = require('lodash');

const ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).end();
    }
};

router.get('/:userId/friends', ensureAuthenticated, function(req, res, next) {
    User.findById(req.params.userId)
        .populate('friends')
        .then(function(user) {
            res.send(user.friends);
        });
});
