'use strict';

app.config(function($stateProvider) {

    $stateProvider.state('interviewee-page', {
        url: '/interviewee-page',
        templateUrl: 'js/programming-page/interviewee-page.html',
        controller: 'ProgrammingPageCtrl',
        params: {
            offeror: null,
            partnerUser: null,
            notification: null
        },
        resolve: {
            currentUser: function(AuthService) {
                return AuthService.getLoggedInUser();
            }
        }
    })
    .state('interviewer-page', {
        url: '/interviewer-page',
        templateUrl: 'js/programming-page/interviewer-page.html',
        controller: 'ProgrammingPageCtrl',
        params: {
            offeror: null,
            partnerUser: null,
            notification: null
        },
        resolve: {
            currentUser: function(AuthService) {
                return AuthService.getLoggedInUser();
            }
        }
    }).state('solve-page', {
        url: '/solve-page',
        templateUrl: 'js/programming-page/solve-page.html',
        controller: 'ProgrammingPageCtrl',
        params: {
            offeror: null,
            partnerUser: null,
            notification: null
        },
        resolve: {
            currentUser: function(AuthService) {
                return AuthService.getLoggedInUser();
            }
        }
    }).state('programming-page', {
        url: '/programming-page',
        templateUrl: 'js/programming-page/programming-page.html',
        controller: 'ProgrammingPageCtrl',
        params: {
            offeror: null,
            partnerUser: null,
            notification: null
        },
        resolve: {
            currentUser: function(AuthService) {
                return AuthService.getLoggedInUser();
            }
        }
    });
});
