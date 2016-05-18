'use strict';

app.config(function($stateProvider){
  $stateProvider.state('problems', {
    url: '/problems',
    templateUrl: 'js/problems/views/problems.html',
    controller: 'ProblemsController',
    resolve: {
        user: (AuthService, $log) => {
            return AuthService.getLoggedInUser()
            .catch($log.error);
        }
    }
  })
  .state('createProblem', {
    url: '/createProblem',
    templateUrl: 'js/problems/views/createProblem.html',
    controller: 'ProblemsController'
  });
});
