app.directive('navbar', function($rootScope, AuthService, AUTH_EVENTS, $state) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/common/directives/navbar/navbar.html',
        link: function(scope) {

            scope.items = [
                { label: 'Dashboard', state: 'dashboard', icon: 'code', auth: true },
                // { label: 'Ebb', state: 'home', icon: 'home' },
                // { label: 'About', state: 'about', icon: 'pets' },
                // { label: 'Problems', state: 'problems', icon: 'work', auth: true },
                // { label: 'Workspace', state: 'workspace', icon: 'video_label', auth: true },
                { label: 'Users', state: 'userList', auth: true }
            ];

            scope.user = null;

            scope.isLoggedIn = function() {
                return AuthService.isAuthenticated();
            };

            scope.logout = function() {
                AuthService.logout().then(function() {
                    $state.go('home');
                });
            };

            var setUser = function() {
                AuthService.getLoggedInUser().then(function(user) {
                    scope.user = user;
                });
            };

            var removeUser = function() {
                scope.user = null;
            };

            setUser();

            $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
            $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
            $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);

            scope.openMenu = function($mdOpenMenu, ev) {
                $mdOpenMenu(ev);
            };

        }

    };

});
