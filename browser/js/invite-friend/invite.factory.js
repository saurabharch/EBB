app.factory('InviteFactory', function($http){
  let InviteFactory = {};

  InviteFactory.getFriends = function(currentUserId){
    return $http.get('/api/users/' + currentUserId + '/friends'); // idk if we have access to currentUser here....
  };

  return InviteFactory;
});
