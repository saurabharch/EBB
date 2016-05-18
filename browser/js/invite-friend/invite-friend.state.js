'use strict';

app.config(function($stateProvider) {
    $stateProvider.state('inviteFriend', {
        url: '/invite-friend/:scenarioType/:scenarioId/:problemId',
        templateUrl: 'js/invite-friend/invite-friend.html',
        controller: 'InviteFriendCtrl',
        resolve: {
            user: (AuthService) => AuthService.getLoggedInUser(),
            friends: (AuthService, FriendFactory) => {
                return AuthService.getLoggedInUser()
                    .then((user) => FriendFactory.getFriends(user._id));
            }
        },
        params: {
            scenarioId: {
                value: null,
                squash: true
            },
            problemId: {
                value: null,
                squash: true
            }
        }
    });
});
