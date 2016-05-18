'use strict';

app.config(($stateProvider) => {
    $stateProvider.state('friendsPage', {
        url: '/friends',
        templateUrl: 'js/friends-page/friends-page.html',
        controller: 'FriendsPageCtrl',
        resolve: {
            user: (AuthService, $log) => {
                return AuthService.getLoggedInUser()
                    .catch($log.error);
            },
            friends: (AuthService, FriendFactory, $log) => {
                return AuthService.getLoggedInUser()
                    .then((user) => FriendFactory.getFriends(user._id))
                    .catch($log.error);
            },
            allUsers: (UsersFactory, $log) => {
                return UsersFactory.getAllUsers()
                    .catch($log.error);
            }
        }
    });
});
