app.factory('InviteFriendFactory', function($http, $rootScope, Socket, LoggedInUsersFactory) {
    const InviteFriendFactory = {};
    const friendsCache = [];

    function getData(res) {
        return res.data;
    }

    function updateFriendsCacheProperties (loggedInUsers) {
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
        angular.copy(friendsArr, friendsCache);
    }

    InviteFriendFactory.getFriends = (userId) => {
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

    Socket.on('updateLoggedInUsers', function(loggedInUsers) {
        updateFriendsCacheProperties(loggedInUsers);
        $rootScope.$evalAsync();
    });

    return InviteFriendFactory;
});
