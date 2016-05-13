app.config(function($stateProvider) {
    $stateProvider.state('workspaceMain', {
        url: '/workspace/:workspaceId',
        templateUrl: 'js/workspace/workspace-main.html',
        controller: 'WorkspaceMainCtrl',
        params: {
            offeror: null,
            partnerUser: null,
            notification: null
        },
        resolve: {
            workspace: function($stateParams, WorkspaceFactory) {
                return WorkspaceFactory.getWorkspaceById($stateParams.workspaceId);
            }
        }
    });
});

app.controller('WorkspaceMainCtrl', ($scope, $log, RunTests, workspace, WorkspaceFactory, $mdToast) => {
    function showSavedWorkspaceToast() {
        $mdToast.show(
            $mdToast.simple()
            .textContent('Workspace saved')
            .position('top right')
            .highlightAction(true)
            .hideDelay(3000)
        );
    }

    $scope.workspace = workspace;

    $scope.saveWorkspace = function() {
        WorkspaceFactory.saveWorkspace($scope.workspace)
            .then(function(savedWorkspace) {
                $scope.workspace = savedWorkspace;
                showSavedWorkspaceToast();
            })
            .catch($log.error);
    };

    $scope.submit = () => {
        RunTests.submitCode({ code: $scope.theCode })
            .then((returnedValue) => console.log(returnedValue))
            .catch($log.error);
    };
});
