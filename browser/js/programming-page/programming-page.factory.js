'use strict';

app.factory('ProgrammingPageFactory', function($http, Socket) {
    const ProgrammingPageFactory = {};

    function getData(res) {
        return res.data;
    }

    ProgrammingPageFactory.getOpenTokCreds = function() {
        return $http.get('/getSession')
            .then(getData);
    };

    return ProgrammingPageFactory;
});
