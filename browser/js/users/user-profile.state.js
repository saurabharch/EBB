'use strict';

app.config(function($stateProvider) {
    $stateProvider.state('userProfile', {
        url: '/user-profile',
        templateUrl: 'js/users/user-profile.html',
        controller: 'UserProfileCtrl',
        resolve: {
            user: (AuthService, $log) => {
                return AuthService.getLoggedInUser()
                    .catch($log.error);
            },
            interviews: (WorkspaceFactory, AuthService, $log) => {
                return AuthService.getLoggedInUser()
                    .then((user) => {
                        return WorkspaceFactory.getUserInterviews(user._id);
                    })
                    .catch($log.error);
            },
            solves: (WorkspaceFactory, AuthService, $log) => {
                return AuthService.getLoggedInUser()
                    .then((user) => {
                        return WorkspaceFactory.getUserSolves(user._id);
                    })
                    .catch($log.error);
            }
        }
    });
});
