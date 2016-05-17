app.config(function($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'HomeCtrl'
    });
});

app.controller('HomeCtrl', function($scope, parallaxHelper) {
    $scope.background = parallaxHelper.createAnimator(-0.7, 130, -130);



});


