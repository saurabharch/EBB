'use strict';

app.config(($stateProvider) => {
    $stateProvider.state('solution', {
        url: '/solution/:problemId',
        templateUrl: 'js/solutions/solutions.html',
        controller: 'SolutionsCtrl',
        params: {
          hasSolved: false
        },
        resolve: {
            theProblem: ($stateParams, ProblemsFactory) => {
                return ProblemsFactory.getProblemById($stateParams.problemId);
            }
        }
    });
});
