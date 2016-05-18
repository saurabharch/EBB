'use strict';

app.controller('ProblemsController', function($scope, ProblemsFactory, $stateParams, $state, user){
  ProblemsFactory.getAllProblems().then(function(problems){
    $scope.problems = problems.data;
  });

  $scope.user = user;

  $scope.problemToSolve = $stateParams.problemToSolve;

  $scope.createProblem = ProblemsFactory.createProblem;

  $scope.openFeed = false;

  $scope.openMenu = ($mdOpenMenu, ev) => {
    $mdOpenMenu(ev);
  };

  $scope.randomlyPair = function(){
    console.log('randomly pair hit')
    $state.go('programming-page');
  };

  $scope.workWithFriend = function(){
    console.log('work with friend hit')
    $state.go('programming-page');
  };
});
