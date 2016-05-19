'use strict';
const router = require('express').Router();
module.exports = router;
const mongoose = require('mongoose');
const Notification = mongoose.model('Notification');

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).end();
    }
};

router.post('/', ensureAuthenticated, (req, res, next) => {
    Notification.create(req.body)
        .then((notification) => { res.send(notification); });
});

router.get('/user/:userId', ensureAuthenticated, (req, res, next) => {
    Notification.find({toUser: req.params.userId})
    .populate('toUser fromUser')
    .then((notifications) => {
        res.send(notifications);
    });
});

router.delete('/:notificationId', ensureAuthenticated, (req, res, next) => {
    Notification.remove({_id: req.params.notificationId})
        .then(() => { res.sendStatus(204); });
});
