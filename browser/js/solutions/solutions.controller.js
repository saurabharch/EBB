'use strict';

app.controller('SolutionsCtrl', ($scope, $log, theProblem, CommentsFactory) => {

    $scope.problem = theProblem;

    CommentsFactory.fetchByProblem(theProblem._id)
    .then((comments) => $scope.comments = comments)
    .catch($log.error);

});
