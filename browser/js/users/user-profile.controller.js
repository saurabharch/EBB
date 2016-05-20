app.controller('UserProfileCtrl', ($scope, user, interviews, solves) => {
    $scope.user = user;

    $scope.pastInterviews = interviews;
    $scope.solvedProblems = solves.filter((workspace) => workspace.solved);
    $scope.unsolvedProblems = solves.filter((workspace) => !workspace.solved);
});
