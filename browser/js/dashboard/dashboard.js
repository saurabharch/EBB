app.config(function($stateProvider){
  $stateProvider.state('dashboard', {
    url: '/dashboard',
    templateUrl: 'js/dashboard/dashboard.html',
    controller: 'DashboardCtrl'
  });
});

app.controller('DashboardCtrl', function($scope){
  $scope.openMenu = function($mdOpenMenu, ev) {
      $mdOpenMenu(ev);
  };
});
