'use strict';

app.directive('videoChat', () => {

    return {
        restrict: 'E',
        templateUrl: 'js/video-chat/video-chat.html',
        scope: {
            user: '=',
            partnerUser: '=',
            workspace: '='
        },
        controller: 'VideoChatCtrl'
    };

});

app.controller('VideoChatCtrl', ($scope, LoggedInUsersFactory, VideoChatFactory, $log, Socket) => {

    const loggedInUsers = LoggedInUsersFactory.getLoggedInUsers();

    $scope.startVideo = () => {
        const toUser = loggedInUsers[$scope.partnerUser.username];
        const fromUser = loggedInUsers[$scope.user.username];
        VideoChatFactory.initiateVideoChat(toUser, fromUser, $scope.workspace)
        .then(() => {
            $scope.madeOffer = true;
        })
        .catch($log.error);
    };

    Socket.on('receiveVideoChatOffer', () => {
        $scope.madeOffer = true;
        $scope.receivedOffer = true;
        $scope.$evalAsync();
    });

    $scope.acceptVideoRequest = () => {
        VideoChatFactory.getTokens()
        .then(() => {
            return VideoChatFactory.commenceVideoChat();
        })
        .then(() => {
            $scope.acceptedOffer = true;
            $scope.videoChatLive = true;
            const toUser = loggedInUsers[$scope.partnerUser.username];
            const fromUser = loggedInUsers[$scope.user.username];
            Socket.emit('acceptVideoChatOffer', toUser, fromUser);
        })
        .catch($log.error);
    };

    Socket.on('videoChatOfferAccepted', (toUser, fromUser) => {
        $scope.offerAccepted = true;
        $scope.videoChatLive = true;
        $scope.$evalAsync();
        VideoChatFactory.commenceVideoChat();
    });

    $scope.stopVideoChat = () => {
        const toUser = loggedInUsers[$scope.partnerUser.username];
        const fromUser = loggedInUsers[$scope.user.username];
        $scope.videoChatLive = false;
        $scope.offerAccepted = false;
        $scope.videoChatLive = false;
        $scope.madeOffer = false;
        $scope.receivedOffer = false;
        $scope.acceptedOffer = false;
        VideoChatFactory.stopVideoChat(toUser, fromUser);
    };

    Socket.on('videoChatStopped', () => {
        $scope.videoChatLive = false;
        $scope.offerAccepted = false;
        $scope.videoChatLive = false;
        $scope.madeOffer = false;
        $scope.receivedOffer = false;
        $scope.acceptedOffer = false;
        $scope.$evalAsync();
    });

});
