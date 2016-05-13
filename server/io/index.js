'use strict';
var socketio = require('socket.io');
var io = null;
let loggedInUsers = require('../app/configure/authentication/logged-in-users.js');

module.exports = function(server) {
  if (io) return io;

  io = socketio(server);

  io.on('connection', (socket) => {
    socket.on('disconnect', () => {
      let usernameToDelete;
      console.log('loggedInUsers', loggedInUsers)
      console.log('socketId', socket.id)
      for (let key in loggedInUsers) {
        if (('/#' + loggedInUsers[key].socketId) === socket.id) usernameToDelete = key;
      }

      console.log('usernameToDelete', usernameToDelete)
      delete loggedInUsers[usernameToDelete];
      io.sockets.emit('updateLoggedInUsers', loggedInUsers);
    });

    socket.on('inviteFriend', (toUser, fromUser, invitation) => {
      io.to('/#' + toUser.socketId).emit('receiveInvitation', toUser, fromUser, invitation);
    });

    socket.on('sendOffer', (apiKey, sessionId, targetUser, fromUser) => {
      io.to('/#' + targetUser.socketId).emit('receiveOffer', apiKey, sessionId, fromUser);
    });

    socket.on('acceptOffer', (initiatingUser) => {
      io.to('/#' + initiatingUser.socketId).emit('offerAccepted', initiatingUser.tokens);
    });

    socket.on('madeEdit', (targetUser, newCode) => {
      io.to('/#' + targetUser.socketId).emit('receivedEdit', newCode);
    });
  });

  return io;
};
