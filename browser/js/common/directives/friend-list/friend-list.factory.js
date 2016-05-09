app.factory('FriendListFactory', function($http){
  let FriendListFactory = {};

  FriendListFactory.getUsersFriends = function(userId){
    return $http.get('/api/users/' + userId + '/friends')
    .then(function(friendList){
      return friendList.data;
    });
  };

  return FriendListFactory;
});
