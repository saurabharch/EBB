app.config(function($stateProvider){
  $stateProvider.state('matcher', {
    url: '/matcher',
    templateUrl: 'js/matcher-page/matcher.html',
    params: {
      problemToSolve: null
    },
    controller: 'ProblemsController'
  });
});
