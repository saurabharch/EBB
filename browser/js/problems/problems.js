app.controller('ProblemsController', function($scope, ProblemsFactory, $stateParams, $state, AuthService){
  ProblemsFactory.getAllProblems().then(function(problems){
    $scope.problems = problems.data;
  });

  $scope.problemToSolve = $stateParams.problemToSolve;

  $scope.createProblem = ProblemsFactory.createProblem;

  $scope.openFeed = false;

  $scope.randomlyPair = function(){
    console.log('randomly pair hit')
    $state.go('programming-page');
  };

  $scope.workWithFriend = function(){
    console.log('work with friend hit')
    $state.go('programming-page');
  };
});

app.config(function($stateProvider){
  $stateProvider.state('problems', {
    url: '/problems',
    templateUrl: 'js/problems/views/problems.html',
    controller: 'ProblemsController'
  })
  .state('createProblem', {
    url: '/createProblem',
    templateUrl: 'js/problems/views/createProblem.html',
    controller: 'ProblemsController'
  });
});
