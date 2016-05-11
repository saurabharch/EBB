app.factory('NotificationsFactory', function($http){
  let NotificationsFactory = {};

  NotificationsFactory.sendNotification = function(toUser, type){
    console.log('sending a notification')
    return $http.post('/api/users/notification', {to: toUser, type: type});
  };

  NotificationsFactory.getNotifications = function(userId){
    return $http.get('/api/users/' + userId + '/notifications');
  };

  NotificationsFactory.acceptNotification = function(notification){
    // console.log('accepting notification', notification)
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
    console.log('confirming friend. from this chump: ', notification.from);
    $http.post('/api/users/confirmFriend/' + notification.from._id, notification.to._id);
  };

  let acceptInterviewOffer = function(notification){
    // state.go to interviewee
    // the acceptor will always be the interviewee
  };

  return NotificationsFactory;
});
