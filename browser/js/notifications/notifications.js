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

app.controller('NotificationsCtrl', function($scope, notifications, NotificationsFactory, $mdDialog, $log, $mdToast) {
    $scope.notifications = notifications;

    function showNewFriendToast() {
        $mdToast.show(
            $mdToast.simple()
            .textContent('Added a new friend')
            .position('top right')
            .hideDelay(3000)
        );
    }

    $scope.acceptInvitation = (notification) => {
        NotificationsFactory.acceptNotification(notification)
        .then(() => {
            if (notification.scenarioType === 'friend') {
                showNewFriendToast();
            }
        })
        .catch($log.error);
    };

    $scope.deleteNotification = (ev, notification) => {
        let confirm = $mdDialog.confirm()
            .title('Confirm deletion of invitation')
            .ariaLabel('Delete invitation')
            .targetEvent(ev)
            .ok('Confirm')
            .cancel('Cancel');
        $mdDialog.show(confirm).then(() => {
            NotificationsFactory.deleteNotification(notification._id)
            .catch($log.error);
        });
    };
});
