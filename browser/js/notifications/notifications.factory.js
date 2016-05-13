// app.factory('NotificationsFactory', function($http, $state, LoggedInUsersFactory){
//   let NotificationsFactory = {};
//
//   NotificationsFactory.sendNotification = function(toUser, type){
//     console.log('sending a notification')
//     return $http.post('/api/users/notification', {to: toUser, type: type});
//   };
//
//   NotificationsFactory.getNotifications = function(userId){
//     return $http.get('/api/users/' + userId + '/notifications');
//   };
//
//   NotificationsFactory.acceptNotification = function(notification){
//     console.log('accepting notification', notification)
//     if(notification.type === "Friend"){
//       acceptFriendRequest(notification);
//     } else if(notification.type === "Interviewee"){ // the offeror will always be the interviewer first
//       acceptInterviewOffer(notification);
//     } else if(notification.type === "Solve"){
//       // acceptWorkspaceOffer(notification);
app.factory('NotificationsFactory', function($http, $state, Socket, $rootScope) {
    const NotificationsFactory = {};
    const notificationsCache = [];

    function getData(res) {
        return res.data;
    }

    Socket.on('receiveInvitation', (thisUser) => {
        NotificationsFactory.getNotifications(thisUser._id);
    });

    NotificationsFactory.sendNotification = (toUser, fromUser, scenarioType, scenarioId) => {
        const notification = {
            toUser: toUser._id,
            fromUser: fromUser._id,
            scenarioType: scenarioType
        };
        notification[scenarioType + 'Id'] = scenarioId

        return $http.post('/api/notifications/', notification)
            .then(getData)
            .then((sentNotification) => {
                Socket.emit('inviteFriend', toUser, fromUser, sentNotification);
                return sentNotification;
            });
    };

    NotificationsFactory.getNotifications = (userId) => {
        return $http.get('/api/notifications/user/' + userId)
            .then(getData)
            .then((notifications) => {
                angular.copy(notifications, notificationsCache);
                return notificationsCache;
            });
    };

    NotificationsFactory.deleteNotification = (notificationId) => {
        return $http.delete('/api/notifications/' + notificationId)
            .then(() => {
                const index = notificationsCache.findIndex((notification) => notification._id === notificationId);
                notificationsCache.splice(index, 1);
            });
    };

    // Socket.on('receiveInvitation', (toUser, fromUser, scenarioType, scenarioId) => {
    //     invitations[scenarioType].push({
    //         fromUser: fromUser,
    //         scenarioId: scenarioId
    //     });
    //     localStorage.setItem('usersWhoAreLoggedIn', JSON.stringify(usersWhoAreLoggedIn));
    //     $rootScope.$evalAsync();
    // });

    // NotificationsFactory.sendNotification = function(toUser, type){
    //   console.log('sending a notification')
    //   return $http.post('/api/users/notification', {to: toUser, type: type});
    // };

    // NotificationsFactory.getNotifications = function(userId){
    //   return $http.get('/api/users/' + userId + '/notifications');
    // };

    // NotificationsFactory.acceptNotification = function(notification){
    //   console.log('accepting notification', notification)
    //   if(notification.type === "Friend"){
    //     acceptFriendRequest(notification);
    //   } else if(notification.type === "Interviewee"){ // the offeror will always be the interviewer first
    //     acceptInterviewOffer(notification);
    //   } else if(notification.type === "Solve"){
    //     // acceptWorkspaceOffer(notification);
    //   }
    // };

    // NotificationsFactory.denyNotification = function(notification){
    //   $http.delete('/api/users/notification/' + notification._id);
    // };

// <<<<<<< HEAD
//   let acceptFriendRequest = function(notification){
//     $http.post('/api/users/confirmFriend/' + notification.from._id, notification.to._id);
//   };
//
//   let acceptInterviewOffer = function(notification){
//     console.log('accepting interview offer in not. factory, loggedInUsers ', LoggedInUsersFactory.getLoggedInUsers(), notification.from)
//     var partner = LoggedInUsersFactory.getLoggedInUsers()[notification.from.username];
//     console.log('heres partner', partner)
//     $state.go('programming-page', {offeror: false, partnerUser: partner});
//   };
// =======
    // let acceptFriendRequest = function(notification){
    //   console.log('confirming friend. from this chump: ', notification.from);
    //   $http.post('/api/users/confirmFriend/' + notification.from._id, notification.to._id);
    // };

    // let acceptInterviewOffer = function(notification){
    //   $state.go('programming-page', {offeror: notification.to, partnerUser: notification.from});
    //   // state.go to interviewee
    //   //
    //   // the acceptor will always be the interviewee
    // };
    return NotificationsFactory;
});
