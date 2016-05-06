'use strict';

app.factory('RunTests', ($http) => {

    const Obj = {};
    const glotRoute = 'https://run.glot.io/languages/javascript/latest';

    Obj.submitCode = (code) => {
        return $http.post(glotRoute, {
            "files": [
                {
                    "name": "main.js",
                    "content": JSON.stringify(code)
                }
            ]
        }, {
            headers: {
                "Authorization": "Token " + tbd,
                "Content-Type": "applications/json"
            }
        })
        .then((results) => results.data);
    };

    return Obj;

});
