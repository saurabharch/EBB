'use strict';

app.directive('navbar', function($rootScope, AuthService, AUTH_EVENTS, $state, $mdSidenav, $timeout, NotificationsFactory, $log) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/common/directives/navbar/navbar.html',
        link: function(scope) {

            scope.items = [
                { label: 'Home', state: 'home', icon: 'home' },
                { label: 'Problems', state: 'problems', icon: 'work', auth: true },
                { label: 'Workspace', state: 'workspace', icon: 'video_label', auth: true },
                { label: 'Friends', state: 'friendsPage', icon: 'face', auth: true }
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
                AuthService.getLoggedInUser()
                    .then((user) => {
                        scope.user = user;
                        return user;
                    })
                    .then(function(user) {
                        if(user) {
                            NotificationsFactory.getNotifications(user._id)
                                .then(function(notifications) {
                                    scope.notifications = notifications;
                                });
                        }
                    })
                    .catch($log.error);
            };

            var removeUser = function() {
                scope.user = null;
            };

            setUser();

            $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
            $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
            $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);

            // *** For logged in users ***
            scope.openMenu = function($mdOpenMenu, ev) {
                $mdOpenMenu(ev);
            };

            scope.openSidenav = () => {
                $mdSidenav('left').toggle();
            };

        }

    };

});
