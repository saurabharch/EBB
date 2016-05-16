'use strict';

app.directive('ebbWorkspaceToolbar', () => {

    return {
        restrict: 'E',
        templateUrl: 'js/ebb/ebb-workspace-toolbar.html',
        scope: {
            workspace: '=',
            user: '='
        },
        controller: 'EbbWorkspaceToolbarCtrl'
    };

});

app.controller('EbbWorkspaceToolbarCtrl', ($scope, $state, WorkspaceFactory, $log, $mdToast, $mdDialog) => {
    $scope.isCreator = $scope.user._id === $scope.workspace.creator._id;

    function showSavedWorkspaceToast() {
        $mdToast.show(
            $mdToast.simple()
            .textContent('Workspace saved')
            .position('top right')
            .hideDelay(3000)
        );
    }

    function showWorkspaceDeleteToast() {
        $mdToast.show(
            $mdToast.simple()
            .textContent('Workspace deleted')
            .position('top right')
            .hideDelay(3000)
        );
    }

    function showUnableToDeleteToast() {
        $mdToast.show(
            $mdToast.simple()
            .textContent('Unable to delete workspace - please try again')
            .position('top left right')
            .hideDelay(3000)
        );
    }

    $scope.inviteFriend = () => {
        $state.go('inviteFriend', {scenarioType: 'workspace', scenarioId: $scope.workspace._id});
    };

    $scope.saveWorkspace = () => {
        WorkspaceFactory.saveWorkspace($scope.workspace)
            .then(function(savedWorkspace) {
                $scope.workspace = savedWorkspace;
                showSavedWorkspaceToast();
            })
            .catch($log.error);
    };

    $scope.showInfo = (ev) => {
        let htmlToDisplay = `<p>Creator: ${$scope.workspace.creator.username}</p>
                            <p>Created: ${$scope.workspace.dateCreated}</p>
                            <p>Modified: ${$scope.workspace.dateLastModified}</p>`;
        $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title($scope.workspace.name)
            .htmlContent(htmlToDisplay)
            .ariaLabel('Workspace Info')
            .ok('Okay')
            .targetEvent(ev)
        );
    };

    $scope.deleteWorkspace = function(ev) {
        let confirm = $mdDialog.confirm()
            .title('Are you sure you want to delete this workspace?')
            .ariaLabel('Delete workspace')
            .targetEvent(ev)
            .ok('Okay')
            .cancel('Cancel');
        $mdDialog.show(confirm).then(() => {
            WorkspaceFactory.deleteWorkspace($scope.workspace._id)
                .then(function() {
                    showWorkspaceDeleteToast();
                    $state.go('workspace');
                })
                .catch(function() {
                    showUnableToDeleteToast(ev);
                });
        });
    };

});
