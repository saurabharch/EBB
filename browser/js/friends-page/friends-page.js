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

app.controller('FriendsPageCtrl', function($scope, user, friends, allUsers, $mdDialog, FriendFactory, $log) {
    $scope.user = user;
    $scope.friends = friends;
    $scope.allUsers = allUsers;

    $scope.findFriend = (ev) => {
        $mdDialog.show({
            controller: 'FindFriendsDialogCtrl',
            templateUrl: 'js/friends-page/find-friends-dialog.html',
            scope: $scope,
            preserveScope: true,
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true
        });
    };

    $scope.deleteFriend = (ev, friend) => {
        let confirm = $mdDialog.confirm()
            .title('Confirm de-friending')
            .ariaLabel('Delete friend')
            .targetEvent(ev)
            .ok('Confirm')
            .cancel('Cancel');
        $mdDialog.show(confirm).then(() => {
            FriendFactory.deleteFriend(friend, $scope.user)
                .catch($log.error);
        });
    };

});

app.controller('FindFriendsDialogCtrl', ($scope, $mdDialog, $state, NotificationsFactory, $mdToast) => {

    let allUsersNotFriends = $scope.allUsers.filter((user) => {
        return !$scope.friends.find((friend) => user._id === friend._id) && user._id !== $scope.user._id;
    });

    function showFriendRequestSentToast(invitee) {
        $mdToast.show(
            $mdToast.simple()
            .textContent('Friend request sent to ' + invitee.username)
            .position('top right')
            .hideDelay(3000)
        );
    }

    $scope.querySearch = (query) => {
        return query ? allUsersNotFriends.filter((user) => {
            let username = user.username.toLowerCase();
            let email = user.email.toLowerCase();
            query = angular.lowercase(query);

            return (username.indexOf(query) === 0 || email.indexOf(query) === 0);
        }) : allUsersNotFriends;
    };

    $scope.cancel = () => {
        $mdDialog.cancel();
    };
    $scope.finish = () => {
        NotificationsFactory.sendNotification($scope.selectedUser, $scope.user, 'friend')
            .then(() => {
                showFriendRequestSentToast($scope.selectedUser);
                $mdDialog.hide();
            });
    };



});
