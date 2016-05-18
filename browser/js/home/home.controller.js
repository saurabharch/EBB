'use strict';

app.controller('HomeCtrl', function($scope, parallaxHelper) {

    $scope.background = parallaxHelper.createAnimator(-0.7, 130, -130);

});
