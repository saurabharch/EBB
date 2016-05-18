'use strict';

app.directive('friendOrRandom', () => {

    return {
        restrict: 'E',
        templateUrl: 'js/problems/views/friendOrRandom.html',
        scope: {
            intOrSolve: '@',
            problemId: '@',
            user: '='
        },
        controller: ($scope, LoggedInUsersFactory, NotificationsFactory, $log, $mdDialog) => {
            function showWaitingAlertDialog() {
                $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title('Please wait for a random user to accept your request')
                    .textContent('Once a random user accepts your request, you will be redirected to a shared workspace.')
                    .ariaLabel('Please wait')
                    .ok('Okay')
                );
            }

            $scope.openMenu = ($mdOpenMenu, ev) => {
                $mdOpenMenu(ev);
            };
            $scope.random = () => {
                const loggedInUsers = LoggedInUsersFactory.getLoggedInUsers();
                const potentialUsersToInvite = {};
                angular.copy(loggedInUsers, potentialUsersToInvite);
                delete potentialUsersToInvite[$scope.user.username];
                const randomUser = _.sample(potentialUsersToInvite);

                NotificationsFactory.sendNotification(randomUser, loggedInUsers[$scope.user.username], $scope.intOrSolve, undefined, $scope.problemId)
                    .then(() => {
                        showWaitingAlertDialog();
                    })
                    .catch($log.error);
            }
        }
    };

});

app.filter('capitalize', () => {
    return (string) => {
        return string.charAt(0).toUpperCase() + string.substr(1);
    };
});
