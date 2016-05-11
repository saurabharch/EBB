app.controller('InviteCtrl', function($scope, InviteFactory, AuthService){

  AuthService.getLoggedInUser()
  .then(function(currentUser){
    InviteFactory.getFriends(currentUser._id)
    .then(function(friendArray){
      $scope.friends = friendArray.data;
    });
  });

  $scope.inviteFriend = function(friendsId, workspaceType){
    // sends request to friend, then state.go's to correct workspace
  };

  // $scope.type = type;
});
