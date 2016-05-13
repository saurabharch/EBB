var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Notification = mongoose.model('Notification');

router.get('/', function(req, res, next) {
    User.find({}).exec()
        .then(function(users) {
            res.json(users);
        })
        .catch(next);
});

router.get('/:userId/', function(req, res, next){
  User.findById(req.params.userId)
  .then(function(user){
    console.log('found user: ', user);
    res.json(user);
  });
});

router.get('/:userId/friends', function(req, res, next){
  User.findById(req.params.userId)
  .populate('friends')
  .then(function(user){
    res.json(user.friends);
  });
});

router.get('/:userId/notifications', function(req, res, next){

  Notification.find({to: req.params.userId})
  .populate('from')
  .then(function(notifications){
    console.log('notifications in the route, populated -from-', notifications);
    res.json(notifications);
  });
});

router.post('/addFriend/:friendId', function(req, res, next){
  if(req.params.friendId != req.user._id && req.user.friends.indexOf(req.params.friendId) === -1){ // also should account for if they're already friends
    Notification.create({type: 'Friend', from: req.user._id, to: req.params.friendId})
    .then(function(notification){
      notification.save();
      res.sendStatus(201);
    });
  } else {
    res.sendStatus(401);
  }
});

router.post('/confirmFriend/:friendId', function(req, res, next){
  if(req.params.friendId !== req.user._id){ // also should account for if they're already friends
    User.findById(req.user._id)
    .then(function(user){
      user.friends.push(req.params.friendId);
      user.save();
    });

    User.findById(req.params.friendId)
    .then(function(user){
      user.friends.push(req.user._id);
      user.save();
    });
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});

router.post('/', function(req, res, next) {
    if (req.body.username.length && req.body.password.length) { // in case we want to incorporate Google Signin or something
        User.create(req.body)
            .then(function(user) {
                res.status(201).json(user);
            })
            .catch(next);
    } else {
        res.send(401);
    }
});

router.post('/notification', function(req, res, next){
  req.body.from = req.user._id;
  Notification.create(req.body)
  .then(function(notification){
    console.log('notification created in routes', notification)
    res.sendStatus(201);
  });
});

router.delete('/notification/:notificationId', function(req, res, next){
  Notification.remove({ _id: req.params.notificationId }, function(err){
    console.log("failed to delete notification: ", err);
  });
});
