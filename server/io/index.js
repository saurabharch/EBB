'use strict';
var socketio = require('socket.io');
var io = null;
let loggedInUsers = require('../app/configure/authentication/logged-in-users.js');

module.exports = function(server) {
  if (io) return io;

  io = socketio(server);

  io.on('connection', (socket) => {
    if (socket.handshake.session && socket.handshake.session.user) {
      loggedInUsers[socket.handshake.session.user.username] = socket.handshake.session.user;
      loggedInUsers[socket.handshake.session.user.username].socketId = socket.id.slice(2);
      io.sockets.emit('updateLoggedInUsers', loggedInUsers);
    }

    socket.on('disconnect', () => {
      let usernameToDelete;
      for (let key in loggedInUsers) {
        if (('/#' + loggedInUsers[key].socketId) === socket.id) usernameToDelete = key;
      }
      delete loggedInUsers[usernameToDelete];
      io.sockets.emit('updateLoggedInUsers', loggedInUsers);
    });

    socket.on('acceptInvitation', (toUser, fromUser, invitation) => {
      io.to('/#' + toUser.socketId).emit('receiveAcceptance', toUser, fromUser, invitation);
    });

    socket.on('inviteFriend', (toUser, fromUser, invitation) => {
      io.to('/#' + toUser.socketId).emit('receiveInvitation', toUser, fromUser, invitation);
    });

    socket.on('sendVideoChatOffer', (toUser, fromUser, sessionApiKey, sessionId) => {
      io.to('/#' + toUser.socketId).emit('receiveVideoChatOffer', toUser, fromUser, sessionApiKey, sessionId);
    });

    socket.on('acceptVideoChatOffer', (toUser, fromUser) => {
      io.to('/#' + toUser.socketId).emit('videoChatOfferAccepted', toUser, fromUser);
    });

    socket.on('stoppedVideoChat', (toUser, fromUser) => {
      io.to('/#' + toUser.socketId).emit('videoChatStopped', toUser, fromUser);
    });

    socket.on('madeEdit', (toUser, fromUser, workspace) => {
      io.to('/#' + toUser.socketId).emit('receiveEdit', workspace);
    });

    socket.on('friendsNoMore', (toUser, fromUser) => {
      io.to('/#' + toUser.socketId).emit('defriending', toUser, fromUser);
    });

  });

  return io;
};
