'use strict';
var socketio = require('socket.io');
var io = null;

module.exports = function (server) {
    if (io) return io;

    io = socketio(server);

    io.on('connection', function (socket) {
        socket.on('sendOffer', function(apiKey, sessionId, targetUser, fromUser) {
            io.to('/#' + targetUser.socketId).emit('receiveOffer', apiKey, sessionId, fromUser);
        });

        socket.on('acceptOffer', function(initiatingUser) {
            io.to('/#' + initiatingUser.socketId).emit('offerAccepted', initiatingUser.tokens);
        });

        socket.on('madeEdit', function(targetUser, newCode) {
            io.to('/#' + targetUser.socketId).emit('receivedEdit', newCode);
        });
    });

    return io;
};
