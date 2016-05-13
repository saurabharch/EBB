'use strict';

app.directive('friendOrRandom', () => {

    return {
        restrict: 'E',
        templateUrl: 'js/problems/views/friendOrRandom.html',
        scope: {
            intOrSolve: '@',
            problemId: '@'
        },
        controller: ($scope) => {
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
