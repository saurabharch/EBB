app.config(function($stateProvider) {

    $stateProvider.state('invite', {
        url: '/partner-launch/:problemId/:type',
        templateUrl: 'js/partner-launch/partner-launch.html',
        controller: 'PartnerLaunchCtrl',
        resolve: {
            currentUser: function (AuthService) {
                return AuthService.getLoggedInUser();
            }
        },
        params: {
          problemId: {
            value: null,
            squash: true
          }
        }
    });
});

app.controller('PartnerLaunchCtrl', function($scope, LoggedInUsersFactory, currentUser, $state, PartnerLaunchFactory, AuthService, NotificationsFactory, $stateParams) {

    $scope.currentUser = currentUser;

    $scope.type = $stateParams.type;

    $scope.problemId = $stateParams.problemId;

    $scope.loggedInUsers = LoggedInUsersFactory.getLoggedInUsers();

    AuthService.getLoggedInUser()
    .then(function(currentUser){
      PartnerLaunchFactory.getFriends(currentUser._id)
      .then(function(friendArray){
        $scope.friends = friendArray.data;
      });
    });

    $scope.makeOffer = function (targetUser, type) {
      NotificationsFactory.sendNotification(targetUser, type);
      console.log('you made an offer', $scope.loggedInUsers);
      targetUser = $scope.loggedInUsers[targetUser.username];

      console.log('targetUser in partnerLaunch', targetUser, currentUser)
        if(type === "Interviewee"){
          console.log('interviewee')
          // $state.go('programming-page', {offeror: currentUser});
          // $state.go('programming-page', {offeror: true, partnerUser: targetUser});
          $state.go('workspaceMain', {offeror: true, partnerUser: targetUser});

        } else if(type === "Solve"){
          // $state.go('programming-page', {offeror: currentUser});
          $state.go('programming-page', {offeror: true, partnerUser: targetUser});

        } else if(type === "Workspace"){
          // $state.go('programming-page', {offeror: currentUser});
          $state.go('programming-page', {offeror: true, partnerUser: targetUser});
        }
    };

    $scope.acceptOffer = function (initiatingUser, notification) {
      console.log('partner launch acceptOffer')
      if(type === "Interviewer"){
        console.log('interviewer')
        // $state.go('interviewer-page', {offeror: false, partnerUser: initiatingUser});
        $state.go('programming-page', {offeror: false, partnerUser: initiatingUser});
      } else if(type === "Solve"){
        // $state.go('solve-page', {offeror: false, partnerUser: initiatingUser});
        $state.go('programming-page', {offeror: false, partnerUser: initiatingUser});
      } else if(type === "Workspace"){
        $state.go('programming-page', {offeror: false, partnerUser: initiatingUser});
      }
    };
});

app.factory('PartnerLaunchFactory', function($http){
  let PartnerLaunchFactory = {};

  PartnerLaunchFactory.getFriends = function(currentUserId){
    return $http.get('/api/users/' + currentUserId + '/friends'); // idk if we have access to currentUser here....
  };

  return PartnerLaunchFactory;
});
