app.controller('NotificationsCtrl', function($scope, NotificationsFactory, AuthService){
  console.log($scope)
  AuthService.getLoggedInUser()
  .then(function(currentUser){
    NotificationsFactory.getNotifications(currentUser._id)
    .then(function(notifications){
      console.log('found notifications', notifications)
      $scope.notifications = notifications.data;
    });
  });

  $scope.acceptNotification = NotificationsFactory.acceptNotification;

  $scope.denyNotification = function(notification){
    NotificationsFactory.denyNotification(notification);
    $scope.$digest();
  }
});

app.config(function($stateProvider){
  $stateProvider.state('notifications', {
    url: '/notifications',
    templateUrl: '/js/notifications/notifications.html',
    controller: 'NotificationsCtrl'
  });
});
