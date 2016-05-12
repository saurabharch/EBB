'use strict';

app.directive('friendOrRandom', ($state) => {

    return {
        restrict: 'E',
        templateUrl: 'js/problems/views/friendOrRandom.html',
        scope: {
            intOrSolve: '@'
        },
        controller: ($scope) => {
            $scope.friend = () => {
                $state.go('TBD');
            };

            $scope.random = () => {
                $state.go('TBD');
            };

            $scope.openMenu = ($mdOpenMenu, ev) => {
                $mdOpenMenu(ev);
            };
        }
    };

});

app.filter('capitalize', () => {
    return (string) => {
        return string.charAt(0).toUpperCase() + string.substr(1);
    };
});
