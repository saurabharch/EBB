'use strict';

app.directive('ebbTextEditor', () => {

    return {
        restrict: 'E',
        templateUrl: 'js/ebb/ebb-text-editor.html',
        scope: {
            user: '=',
            partnerUser: '=',
            workspace: '='
        },
        controller: 'EbbTextEditorCtrl'
    };

});

app.controller('EbbTextEditorCtrl', ($scope, LoggedInUsersFactory, EbbTextEditorFactory, Socket) => {
    const loggedInUsers = LoggedInUsersFactory.getLoggedInUsers();

    $scope.aceChanged = () => {
        if ($scope.partnerUser && loggedInUsers[$scope.partnerUser.username]) {
            const toUser = loggedInUsers[$scope.partnerUser.username];
            const fromUser = loggedInUsers[$scope.user.username];
            EbbTextEditorFactory.makeChangeToTextEditor(toUser, fromUser, $scope.workspace);
        }
    };

    Socket.on('receiveEdit', function(updatedWorkspace) {
        if ($scope.workspace._id === updatedWorkspace._id) {
            $scope.workspace = updatedWorkspace;
            $scope.$evalAsync();
        }
    });
});
