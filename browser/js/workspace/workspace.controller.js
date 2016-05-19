'use strict';

app.controller('WorkspaceCtrl', function($scope, user, $mdDialog, WorkspaceFactory, $log, $state, $mdToast, workspaces) {

    function showInvalidWorkspaceNameToast(ev) {
        $mdToast.show(
                $mdToast.simple()
                .textContent('Invalid workspace name - please enter a valid name')
                .position('top left right')
                .action('Go back')
                .highlightAction(true)
            )
            .then(function(response) {
                if (response === 'ok') {
                    $scope.createWorkspace(ev);
                }
            });
    }

    $scope.user = user;
    $scope.workspaces = workspaces;

    $scope.createWorkspace = function(ev) {
        let confirm = $mdDialog.prompt()
            .title('What is the name of your new workspace?')
            .placeholder('Enter the name of your new workspace')
            .ariaLabel('Workspace name')
            .targetEvent(ev)
            .ok('Okay')
            .cancel('Cancel');
        $mdDialog.show(confirm).then(function(result) {
            let workspaceInfo = {
                name: result,
                creator: user._id,
                scenarioType: 'workspace'
            };
            WorkspaceFactory.createWorkspace(workspaceInfo)
                .then(function(workspace) {
                    $state.go('workspaceMain', {workspaceId: workspace._id});
                })
                .catch(function() {
                    showInvalidWorkspaceNameToast(ev);
                })

        });
    };

    $scope.goToWorkspace = (workspace) => {
        $state.go('workspaceMain', {workspaceId: workspace._id});
    }

});
