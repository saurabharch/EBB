app.directive('friend-list', function (AuthService, AUTH_EVENTS, $state, LoggedInUsersFactory, FriendListFactory) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/common/directives/friend-list/friend-list.html',
        link: function (scope) {

            scope.user = null;

            scope.isLoggedIn = function () {
              console.log('checking if youre authed');
                return AuthService.isAuthenticated();
            };

            var setUser = function () {
                AuthService.getLoggedInUser()
                .then(function (user) {
                    scope.user = user;
                })
                .then(function(){
                  scope.friends = scope.user;
                });
            };

            var removeUser = function () {
                scope.user = null;
            };

            setUser();

            $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
            $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
            $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);

        }

    };

});
