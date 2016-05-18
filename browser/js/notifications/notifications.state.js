'use strict';

app.config(function($stateProvider) {
    $stateProvider.state('notifications', {
        url: '/notifications',
        templateUrl: '/js/notifications/notifications.html',
        controller: 'NotificationsCtrl',
        resolve: {
            notifications: (AuthService, NotificationsFactory) => {
                return AuthService.getLoggedInUser()
                    .then((user) => NotificationsFactory.getNotifications(user._id));
            }
        }
    });
});
