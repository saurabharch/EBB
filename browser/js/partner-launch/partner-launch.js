app.config(function($stateProvider) {

    $stateProvider.state('partner-launch', {
        url: '/partner-launch',
        templateUrl: 'js/partner-launch/partner-launch.html',
        controller: 'PartnerLaunchCtrl',
        resolve: {
            currentUser: function (AuthService) {
                return AuthService.getLoggedInUser();
            }
        }
    });
});

app.controller('PartnerLaunchCtrl', function($scope, LoggedInUsersFactory, currentUser, $state) {

    $scope.currentUser = currentUser;

    $scope.loggedInUsers = LoggedInUsersFactory.getLoggedInUsers();

    $scope.makeOffer = function (targetUser) {
        $state.go('programming-page', {offeror: true, partnerUser: targetUser});
    };

    $scope.acceptOffer = function (initiatingUser) {
        $state.go('programming-page', {offeror: false, partnerUser: initiatingUser});
    };
});
