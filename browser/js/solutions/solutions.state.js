'use strict';

app.config(($stateProvider) => {
    $stateProvider.state('solution', {
        url: '/solution/:problemId',
        urlTemplate: 'js/solutions/solution-page.html',
        controller: 'SolutionsCtrl',
        resolve: {
            theProblem: ($stateParams, ProblemFactory) => {
                return ProblemFactory.fetchById($stateParams.problemId);
            }
        }
    });
});
