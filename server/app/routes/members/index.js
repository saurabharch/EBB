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

router.get('/:userId/friends', ensureAuthenticated, (req, res, next) => {
    User.findById(req.params.userId)
        .populate('friends')
        .then(function(user) {
            res.send(user.friends);
        });
});

router.get('/', ensureAuthenticated, (req, res, next) => {
    User.find({})
        .populate('friends')
        .then(function(users) {
            res.send(users);
        });
});

router.put('/:userId/addFriend/:friendUserId', ensureAuthenticated, (req, res, next) => {
    User.findById(req.params.userId)
        .then((user) => {
            user.friends.push(req.params.friendUserId);
            return user.save();
        })
        .then(() => {
            return User.findById(req.params.friendUserId);
        })
        .then((friend) => {
            friend.friends.push(req.params.userId);
            return friend.save();
        })
        .then(() => {
            res.sendStatus(204);
        });
});

router.delete('/:userId/friend/:friendUserId', ensureAuthenticated, (req, res, next) => {
    User.findById(req.params.userId)
        .then((user) => {
            user.friends.remove(req.params.friendUserId);
            return user.save();
        })
        .then(() => {
            return User.findById(req.params.friendUserId);
        })
        .then((friend) => {
            friend.friends.remove(req.params.userId);
            return friend.save();
        })
        .then(() => {
            res.sendStatus(204);
        });
});
