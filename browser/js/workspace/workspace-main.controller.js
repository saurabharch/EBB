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

    function showYouAreCorrectDialog() {
        let confirm = $mdDialog.confirm()
            .title('You are correct!!!')
            .ariaLabel('Correct')
            .ok('Okay');
        $mdDialog.show(confirm).then(() => {
            // Do stuff
            // .catch($log.error);
        });
    }

    function showYouAreWrongDialog() {
        $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title('You are incorrect')
            .textContent('Please try again.')
            .ariaLabel('Please try again')
            .ok('Okay')
        );
    }

    $scope.runCode = () => {
        let codeToRun = $scope.workspace.text + (workspace.scenarioType === 'solve' ? workspace.problemId.test : '')
        RunTests.submitCode({ code: codeToRun })
            .then((returnedValue) => {
                $scope.returnVal = returnedValue;
                if ($scope.returnVal.stdout.slice(0,-1) === workspace.problemId.testAnswer && workspace.scenarioType === 'solve') {
                    showYouAreCorrectDialog();
                    $scope.returnVal.stdout = 'You passed'
                } else if (workspace.scenarioType === 'solve'){
                    showYouAreWrongDialog();
                    $scope.returnVal.stdout = 'Incorrect - please try again'
                }

            })
            .catch($log.error);
    };


});
