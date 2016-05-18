'use strict';

app.controller('LoginCtrl', function ($scope, AuthService, $state, Socket) {

    $scope.login = {};
    $scope.error = null;

    $scope.sendLogin = function (loginInfo) {

        $scope.error = null;

        angular.merge(loginInfo, {socketId: Socket.id});

        AuthService.login(loginInfo).then(function () {
            $state.go('home');
        }).catch(function () {
            $scope.error = 'Invalid login credentials.';
        });

    };

});
