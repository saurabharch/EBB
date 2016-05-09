app.config(function($stateProvider){
  $stateProvider.state('workspace', {
    url: '/workspace',
    templateUrl: 'js/workspace/workspace.html',
    controller: ($scope, $log, RunTests) => {
        $scope.submit = () => {
            RunTests.submitCode({ code: $scope.theCode })
            .then((returnedValue) => console.log(returnedValue))
            .catch($log.error);
        };
    }
  });
});
