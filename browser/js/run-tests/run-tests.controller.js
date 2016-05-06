'use strict';

app.controller('RunTestsCtrl', ($scope, $log, RunTests) => {

    $scope.dummyCode = 'function bryan (input) { return input * 2 }; console.log(bryan(42));';

    RunTests.submitCode({ code: $scope.dummyCode })
    .then((returnedValue) => console.log('This is the returned value: ', returnedValue))
    .catch($log.error);

});
