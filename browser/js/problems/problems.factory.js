app.factory('ProblemsFactory', function($http){
  let ProblemsFactory = {};

  ProblemsFactory.getAllProblems = function(){
    return $http.get('/api/problems');
  };

  ProblemsFactory.getProblemById = function(id){
    return $http.get('/api/problems/' + id)
  };

  ProblemsFactory.createProblem = function(problem){
    console.log('problem in ProblemsFactory', problem)
    return $http.post('/api/problems', problem);
  };

  return ProblemsFactory;
});
