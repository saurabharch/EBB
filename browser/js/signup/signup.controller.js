'use strict';

app.controller('SignupCtrl', function ($scope, AuthService, $state, SignupFactory) {

  $scope.error = null;

  $scope.createUser = function(signupInfo) {
    console.log('signing up')
    $scope.error = null;

    if(signupInfo.passwordA !== signupInfo.passwordB){
      $scope.error = 'Your passwords are different!';
    } else {
      SignupFactory.createNewUser({
        email: signupInfo.email,
        password: signupInfo.passwordA,
        username: signupInfo.username
      })
      .then(function() {
        $state.go('login');
      })
      .catch(function() {
        $scope.error = 'Invalid signup credentials.';
      });
    }
  };

});
