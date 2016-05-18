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
