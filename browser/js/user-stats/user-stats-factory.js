'use strict';

app.factory('UserStatsFactory', ($http) => {

    const UserStats = {};
    const userStatsUrl = '/api/userstats/';

    const getData = (res) => res.data;

    UserStats.fetchByUser = (userId) => {
        return $http.get(userStatsUrl + userId)
        .then(getData);
    };

    UserStats.edit = (userId, editsToMake) => {
        return $http.put(userStatsUrl + userId, editsToMake)
        .then(getData);
    };

    UserStats.add = (statsData) => {
        return $http.post(userStatsUrl, statsData)
        .then(getData);
    };

    UserStats.destroy = (userId) => $http.delete(userStatsUrl + userId);

    return UserStats;

});
