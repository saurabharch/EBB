'use strict';

app.factory('RunTests', ($http) => {

    const Obj = {};
    const testUrl = '/api/runcode';
    const getData = (res) => res.data;

    Obj.submitCode = (codeObj) => {
        return $http.post(testUrl, codeObj)
        .then(getData);
    };

    // This is the code to use if we get the API working the way we want
    // so we can send the code straight to Docker from the client:
    // const glotRoute = 'https://run.glot.io/languages/javascript/latest';

    // Obj.submitCode = (scopeObj) => {
    //     return $http.post(glotRoute, {
    //         "files": [
    //             {
    //                 "name": "main.js",
    //                 "content": JSON.stringify(scopeObj.code)
    //             }
    //         ]
    //     }, {
    //         headers: {
    //             "Authorization": "Token ",
    //             "Content-Type": "applications/json"
    //         }
    //     })
    //     .then(getData);
    // };

    return Obj;

});