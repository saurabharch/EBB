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

    function showPairedWithRandomUserToast() {
        $mdToast.show(
            $mdToast.simple()
            .textContent('You have been paired with a random user')
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

    NotificationsFactory.sendNotification = (toUser, fromUser, scenarioType, scenarioId, problemId) => {
        const notification = {
            toUser: toUser._id,
            fromUser: fromUser._id,
            scenarioType: scenarioType
        };
        if (scenarioId) notification[scenarioType + 'Id'] = scenarioId;
        if (problemId) notification.problemId = problemId;

        return $http.post('/api/notifications/', notification)
            .then(getData)
            .then((sentNotification) => {
                toUser = LoggedInUsersFactory.getLoggedInUsers()[toUser.username] || toUser;
                fromUser = LoggedInUsersFactory.getLoggedInUsers()[fromUser.username] || fromUser;
                if (toUser.socketId && fromUser.socketId) { // only use sockets if both users are online
                    Socket.emit('inviteFriend', toUser, fromUser, sentNotification);
                    Socket.on('receiveAcceptance', (toThisUser, fromThisUser, receivedNotification) => {
                        if (notification.scenarioType === 'workspace') {
                            if ($state.current.name === 'workspaceMain') {
                                showPairedWithRandomUserToast();
                            }
                            $state.go('workspaceMain', { workspaceId: receivedNotification.workspaceId }, {reload: true});
                        }
                        if (notification.scenarioType === 'interview') $state.go('workspaceMain', { workspaceId: receivedNotification.workspaceId });
                        if (notification.scenarioType === 'solve') $state.go('workspaceMain', { workspaceId: receivedNotification.workspaceId });
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
        const toUser = LoggedInUsersFactory.getLoggedInUsers()[notification.fromUser.username];
        const fromUser = LoggedInUsersFactory.getLoggedInUsers()[notification.toUser.username];

        function acceptWorkspaceInvite() {
            return WorkspaceFactory.getWorkspaceById(notification.workspaceId)
                .then((workspace) => {
                    workspace.collaborator = notification.toUser;
                    return WorkspaceFactory.saveWorkspace(workspace);
                })
                .then(() => {
                    return NotificationsFactory.deleteNotification(notification._id);
                })
                .then(() => {
                    if (toUser.socketId && fromUser.socketId) { // only use sockets if both users are online
                        Socket.emit('acceptInvitation', toUser, fromUser, notification);
                    }
                    $state.go('workspaceMain', { workspaceId: notification.workspaceId })
                });
        }

        function acceptFriendRequest() {
            return FriendFactory.addNewFriend(notification.toUser, notification.fromUser)
                .then(() => {
                    return NotificationsFactory.deleteNotification(notification._id);
                })
                .then(() => {
                    if (toUser.socketId && fromUser.socketId) {
                        Socket.emit('acceptInvitation', toUser, fromUser, notification);
                    }
                });
        }

        function acceptInterviewInvite() {
            let name = 'Interview of ' + fromUser.username + ' by ' + toUser.username + ' - ' + Date.now();
            const workspaceInfo = {
                creator: fromUser._id,
                collaborator: toUser._id,
                name: name,
                scenarioType: 'interview',
                problemId: notification.problemId
            };
            return WorkspaceFactory.createWorkspace(workspaceInfo)
                .then((workspace) => {
                    notification.workspaceId = workspace._id;
                    return NotificationsFactory.deleteNotification(notification._id);
                })
                .then(() => {
                    if (toUser.socketId && fromUser.socketId) {
                        Socket.emit('acceptInvitation', toUser, fromUser, notification);
                    }
                    $state.go('workspaceMain', { workspaceId: notification.workspaceId })
                });
        }

        function acceptSolveInvite() {
            let name = 'Problem solving - ' + fromUser.username + ' and ' + toUser.username + ' - ' + Date.now();
            const workspaceInfo = {
                creator: fromUser._id,
                collaborator: toUser._id,
                name: name,
                scenarioType: 'solve',
                problemId: notification.problemId
            };
            return WorkspaceFactory.createWorkspace(workspaceInfo)
                .then((workspace) => {
                    notification.workspaceId = workspace._id;
                    return NotificationsFactory.deleteNotification(notification._id);
                })
                .then(() => {
                    if (toUser.socketId && fromUser.socketId) {
                        Socket.emit('acceptInvitation', toUser, fromUser, notification);
                    }
                    $state.go('workspaceMain', { workspaceId: notification.workspaceId })
                });
        }

        if (notification.scenarioType === 'workspace') {
            return acceptWorkspaceInvite();
        }

        if (notification.scenarioType === 'friend') {
            return acceptFriendRequest();
        }

        if (notification.scenarioType === 'interview') {
            return acceptInterviewInvite();
        }

        if (notification.scenarioType === 'solve') {
            return acceptSolveInvite();
        }


    };


    return NotificationsFactory;
});
