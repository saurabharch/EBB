'use strict';

app.factory('FriendFactory', function($http, $rootScope, Socket, LoggedInUsersFactory) {
    const FriendFactory = {};
    const friendsCache = [];

    function getData(res) {
        return res.data;
    }

    function updateFriendsCacheProperties(loggedInUsers) {
        const friendsArr = friendsCache.map((friend) => {
            if (loggedInUsers[friend.username]) {
                friend.online = true;
                friend.disable = false;
                friend.socketId = loggedInUsers[friend.username].socketId;
            } else {
                friend.online = false;
                friend.disable = true;
                friend.socketId = undefined;
            }
            return friend;
        });
        return angular.copy(friendsArr, friendsCache);
    }

    FriendFactory.getFriends = (userId) => {
        return $http.get('/api/members/' + userId + '/friends')
            .then(getData)
            .then((friends) => {
                angular.copy(friends, friendsCache);
                return LoggedInUsersFactory.getLoggedInUsers();
            })
            .then(updateFriendsCacheProperties)
            .then(() => {
                return friendsCache;
            });
    };

    FriendFactory.addNewFriend = (toUser, fromUser) => {
        return $http.put('/api/members/' + fromUser._id + '/addFriend/' + toUser._id)
            .then(() => {
                return LoggedInUsersFactory.getLoggedInUsers();
            })
            .then(updateFriendsCacheProperties)
            .then(() => {
                return friendsCache;
            });
    };

    FriendFactory.deleteFriend = (toUser, fromUser) => {
        return $http.delete('/api/members/' + fromUser._id + '/friend/' + toUser._id)
            .then(() => {
                const index = friendsCache.findIndex((friend) => friend._id === toUser._id);
                friendsCache.splice(index, 1);

                toUser = LoggedInUsersFactory.getLoggedInUsers()[toUser.username] || toUser;
                fromUser = LoggedInUsersFactory.getLoggedInUsers()[fromUser.username] || fromUser;
                if (toUser.socketId && fromUser.socketId) {
                    Socket.emit('friendsNoMore', toUser, fromUser);
                }
            });
    };

    Socket.on('updateLoggedInUsers', function(loggedInUsers) {
        updateFriendsCacheProperties(loggedInUsers);
        $rootScope.$evalAsync();
    });

    Socket.on('receiveAcceptance', (toUser, fromUser, receivedNotification) => {
        if (receivedNotification.scenarioType === 'friend') {
            FriendFactory.getFriends(toUser._id);
        }
    });

    Socket.on('defriending', (toUser, fromUser) => {
        const index = friendsCache.findIndex((friend) => friend._id === fromUser._id);
        friendsCache.splice(index, 1);
        $rootScope.$evalAsync();
    });

    return FriendFactory;
});
