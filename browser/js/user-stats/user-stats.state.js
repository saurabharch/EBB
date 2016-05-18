'use strict';

app.config(($stateProvider) => {
    $stateProvider.state('userStats', {
        url: '/userstats/:userId',
        urlTemplate: 'js/user-stats/user-stats.html',
        controller: 'UserStatsCtrl',
        resolve: {
            theStats: ($stateParams, UserStatsFactory) => {
                return UserStatsFactory.fetchByUser($stateParams.userId);
            }
        }
    });
});
