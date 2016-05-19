'use strict';

app.controller('SolutionsCtrl', ($scope, $log, theProblem, CommentsFactory, AuthService, $stateParams) => {

    // console.log('$sp:', $stateParams);
    $scope.hasSolved = $stateParams.hasSolved;

    AuthService.getLoggedInUser()
    .then((user) => {
      $scope.user = user;
      $scope.newComment = {user: $scope.user, problem: theProblem};
    });

    $scope.problem = theProblem;

    CommentsFactory.fetchByProblem(theProblem._id)
    .then((comments) => {
      $scope.comments = comments;
    })
    .catch($log.error);

    $scope.addComment = CommentsFactory.add;
});
