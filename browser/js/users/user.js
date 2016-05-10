app.config(function($stateProvider){
  $stateProvider.state('userList', {
    url: '/userList',
    templateUrl: 'js/users/user.html',
    controller: 'UserCtrl'
  });
});

app.controller('UserCtrl', function($scope, UserFactory){
  UserFactory.getAllUsers()
  .then(function(users){
    $scope.users = users;
  });

  $scope.addFriend = UserFactory.addFriend;

});

app.factory('UserFactory', function($http){
  let UserFactory = {};

  UserFactory.getAllUsers = function(){
    return $http.get('/api/users')
    .then(function(users){
      return users.data;
    });
  };

  UserFactory.addFriend = function(friendId){
    $http.post('/api/users/addFriend/' + friendId);
  };

  return UserFactory;
});
