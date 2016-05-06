'use strict';

app.controller('RunTestsCtrl', ($scope, $log, RunTests) => {

    $scope.dummyCode = `function bryan (input) {
        return 'Here is the input times 2: ' + input * 2;
    };

    bryan(42);`;

    RunTests.submitCode($scope.dummyCode)
    .then((returnedValue) => console.log(returnedValue))
    .catch($log.error);

});
