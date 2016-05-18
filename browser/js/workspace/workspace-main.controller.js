'use strict';

app.controller('WorkspaceMainCtrl', ($scope, $log, RunTests, user, workspace, WorkspaceFactory, $mdToast, $mdDialog, $state, LoggedInUsersFactory, Socket, VideoChatFactory) => {

    const loggedInUsers = LoggedInUsersFactory.getLoggedInUsers();
    $scope.loggedInUsers = loggedInUsers;
    $scope.user = user;
    $scope.workspace = workspace;
    $scope.isCreator = user._id === workspace.creator._id;
    if (workspace.collaborator) {
        $scope.partnerUser = $scope.isCreator ? workspace.collaborator : workspace.creator;
    }

    $scope.runCode = () => {
        RunTests.submitCode({ code: $scope.workspace.text })
        .then((returnedValue) => $scope.returnVal = returnedValue)
        .catch($log.error);
    };

});
