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
            user: function(AuthService) {
                return AuthService.getLoggedInUser();
            },
            workspace: function($stateParams, WorkspaceFactory) {
                return WorkspaceFactory.getWorkspaceById($stateParams.workspaceId);
            }
        }
    });
});

app.controller('WorkspaceMainCtrl', ($scope, $log, RunTests, user, workspace, WorkspaceFactory, $mdToast, $mdDialog, $state) => {
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

    $scope.user = user;
    $scope.workspace = workspace;
    $scope.isCreator = user._id === workspace.creator._id;

    $scope.inviteFriend = function() {
        $state.go('inviteFriend', {scenarioType: 'workspace', scenarioId: $scope.workspace._id});
    }

    $scope.saveWorkspace = function() {
        WorkspaceFactory.saveWorkspace($scope.workspace)
            .then(function(savedWorkspace) {
                $scope.workspace = savedWorkspace;
                showSavedWorkspaceToast();
            })
            .catch($log.error);
    };

    $scope.showInfo = function(ev) {
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
        $mdDialog.show(confirm).then(function() {
            WorkspaceFactory.deleteWorkspace($scope.workspace._id)
                .then(function() {
                    showWorkspaceDeleteToast();
                    $state.go('workspace');
                })
                .catch(function() {
                    showUnableToDeleteToast(ev);
                })

        });
    };

    $scope.submit = () => {
        RunTests.submitCode({ code: $scope.theCode })
            .then((returnedValue) => console.log(returnedValue))
            .catch($log.error);
    };
});
