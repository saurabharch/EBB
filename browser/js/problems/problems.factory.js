'use strict';

app.factory('ProblemsFactory', ($http) => {
  let ProblemsFactory = {};

  ProblemsFactory.getAllProblems = () => {
    return $http.get('/api/problems');
  };

  ProblemsFactory.getProblemById = (id) => {
    return $http.get('/api/problems/' + id)
    .then((res) => res.data);
  };

  ProblemsFactory.createProblem = (problem) => {
    console.log('problem in ProblemsFactory', problem)
    return $http.post('/api/problems', problem);
  };

  return ProblemsFactory;
});
