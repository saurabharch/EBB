'use strict';

app.factory('UsersFactory', ($http) => {
    const UsersFactory = {};

    function getData(res) {
        return res.data;
    }

    UsersFactory.getAllUsers = () => {
        return $http.get('/api/members/')
        .then(getData);
    };

    return UsersFactory;
});
