'use strict';
var socketio = require('socket.io');
var io = null;

module.exports = function (server) {
    if (io) return io;

    io = socketio(server);

    io.on('connection', function (socket) {
        socket.on('sendOffer', function(apiKey, sessionId, targetUser, fromUser) {
          console.log('sendOffer', targetUser)
            io.to('/#' + targetUser.socketId).emit('receiveOffer', apiKey, sessionId, fromUser);
        });

        socket.on('acceptOffer', function(initiatingUser) {
          console.log('hello');
          console.log('accepting offer in io', initiatingUser)
            io.to('/#' + initiatingUser.socketId).emit('offerAccepted', initiatingUser.tokens);
        });

        socket.on('madeEdit', function(targetUser, newCode) {
          console.log('target User in madeEdit', targetUser.socketId)
          // console.log('currentUser in madeEdit', targetUser.socketId)
            io.to('/#' + targetUser.socketId).emit('receivedEdit', newCode);
        });
    });

    return io;
};
