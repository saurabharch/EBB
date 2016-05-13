app.factory('NotificationsFactory', function($http, $state, LoggedInUsersFactory){
  let NotificationsFactory = {};

  NotificationsFactory.sendNotification = function(toUser, type){
    console.log('sending a notification')
    return $http.post('/api/users/notification', {to: toUser, type: type});
  };

  NotificationsFactory.getNotifications = function(userId){
    return $http.get('/api/users/' + userId + '/notifications');
  };

  NotificationsFactory.acceptNotification = function(notification){
    console.log('accepting notification', notification)
    if(notification.type === "Friend"){
      acceptFriendRequest(notification);
    } else if(notification.type === "Interviewee"){ // the offeror will always be the interviewer first
      acceptInterviewOffer(notification);
    } else if(notification.type === "Solve"){
      // acceptWorkspaceOffer(notification);
    }
  };

  NotificationsFactory.denyNotification = function(notification){
    $http.delete('/api/users/notification/' + notification._id);
  };

  let acceptFriendRequest = function(notification){
    $http.post('/api/users/confirmFriend/' + notification.from._id, notification.to._id);
  };

  let acceptInterviewOffer = function(notification){
    console.log('accepting interview offer in not. factory, loggedInUsers ', LoggedInUsersFactory.getLoggedInUsers(), notification.from)
    var partner = LoggedInUsersFactory.getLoggedInUsers()[notification.from.username];
    console.log('heres partner', partner)
    $state.go('programming-page', {offeror: false, partnerUser: partner});
  };

  return NotificationsFactory;
});
