app.factory('NotificationsFactory', function($http, $state, Socket, WorkspaceFactory, $log, $mdToast, LoggedInUsersFactory, FriendFactory) {
    const NotificationsFactory = {};
    const notificationsCache = [];

    function getData(res) {
        return res.data;
    }

    function showNewNotificationToast() {
        $mdToast.show(
            $mdToast.simple()
            .textContent('You have new notifications')
            .position('top right')
            .hideDelay(3000)
        );
    }

    Socket.on('receiveInvitation', (thisUser) => {
        NotificationsFactory.getNotifications(thisUser._id)
            .then(() => {
                showNewNotificationToast();
            });
    });

    NotificationsFactory.sendNotification = (toUser, fromUser, scenarioType, scenarioId) => {
        const notification = {
            toUser: toUser._id,
            fromUser: fromUser._id,
            scenarioType: scenarioType
        };
        if (scenarioId) notification[scenarioType + 'Id'] = scenarioId;

        return $http.post('/api/notifications/', notification)
            .then(getData)
            .then((sentNotification) => {
                toUser = LoggedInUsersFactory.getLoggedInUsers()[toUser.username] || toUser;
                fromUser = LoggedInUsersFactory.getLoggedInUsers()[fromUser.username] || fromUser;
                if (toUser.socketId && fromUser.socketId) { // only use sockets if both users are online
                    Socket.emit('inviteFriend', toUser, fromUser, sentNotification);
                    Socket.on('receiveAcceptance', (toThisUser, fromThisUser, receivedNotification) => {
                        if (notification.scenarioType === 'workspace') $state.go('workspaceMain', { workspaceId: receivedNotification.workspaceId })
                    });
                }
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

    NotificationsFactory.acceptNotification = (notification) => {
        if (notification.scenarioType === 'workspace') {
            return WorkspaceFactory.getWorkspaceById(notification.workspaceId)
                .then((workspace) => {
                    workspace.collaborator = notification.toUser;
                    return WorkspaceFactory.saveWorkspace(workspace);
                })
                .then(() => {
                    return NotificationsFactory.deleteNotification(notification._id);
                })
                .then(() => {
                    const toUser = LoggedInUsersFactory.getLoggedInUsers()[notification.fromUser.username];
                    const fromUser = LoggedInUsersFactory.getLoggedInUsers()[notification.toUser.username];
                    Socket.emit('acceptInvitation', toUser, fromUser, notification);
                    $state.go('workspaceMain', { workspaceId: notification.workspaceId })
                });
        }

        if (notification.scenarioType === 'friend') {
            return FriendFactory.addNewFriend(notification.toUser, notification.fromUser)
                .then(() => {
                    return NotificationsFactory.deleteNotification(notification._id);
                })
                .then(() => {
                    const toUser = LoggedInUsersFactory.getLoggedInUsers()[notification.fromUser.username];
                    const fromUser = LoggedInUsersFactory.getLoggedInUsers()[notification.toUser.username];
                    if (toUser.socketId && fromUser.socketId) {
                        Socket.emit('acceptInvitation', toUser, fromUser, notification);
                    }
                });
        }

        // if (notification.type === "Friend") {
        //     acceptFriendRequest(notification);
        // } else if (notification.type === "Interviewee") { // the offeror will always be the interviewer first
        //     acceptInterviewOffer(notification);
        // } else if (notification.type === "Solve") {
        //     // acceptWorkspaceOffer(notification);
        // }
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
