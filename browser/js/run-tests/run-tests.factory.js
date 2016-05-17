'use strict';

app.factory('RunTests', ($http) => {

    const testUrl = '/api/runcode';
    const getData = (res) => res.data;

    return {
        submitCode: (codeObj) => {
            return $http.post(testUrl, codeObj)
            .then(getData);
        }
    };

});
