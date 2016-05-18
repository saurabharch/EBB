'use strict';

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
