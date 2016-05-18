'use strict';

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
