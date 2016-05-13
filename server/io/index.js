'use strict';
var socketio = require('socket.io');
var io = null;

module.exports = function (server) {
    if (io) return io;

    io = socketio(server);

    io.on('connection', (socket) => {
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
