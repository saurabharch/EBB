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
            user: (AuthService) => {
                return AuthService.getLoggedInUser();
            },
            workspace: ($stateParams, WorkspaceFactory) => {
                return WorkspaceFactory.getWorkspaceById($stateParams.workspaceId);
            }
        }
    });
});

app.controller('WorkspaceMainCtrl', ($scope, $log, RunTests, user, workspace, WorkspaceFactory, $mdToast, $mdDialog, $state, LoggedInUsersFactory, Socket, VideoChatFactory) => {
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

    const loggedInUsers = LoggedInUsersFactory.getLoggedInUsers();
    $scope.loggedInUsers = loggedInUsers;
    $scope.user = user;
    $scope.workspace = workspace;
    $scope.isCreator = user._id === workspace.creator._id;
    if (workspace.collaborator) {
        $scope.partnerUser = $scope.isCreator ? workspace.collaborator : workspace.creator;
    }

    $scope.inviteFriend = () => {
        $state.go('inviteFriend', {scenarioType: 'workspace', scenarioId: $scope.workspace._id});
    }

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
                })
        });
    };

    $scope.aceChanged = () => {
        if ($scope.partnerUser && loggedInUsers[$scope.partnerUser.username]) {
            const toUser = loggedInUsers[$scope.partnerUser.username];
            const fromUser = loggedInUsers[$scope.user.username];
            WorkspaceFactory.makeChangeToTextEditor(toUser, fromUser, $scope.workspace);
        }
    };

    Socket.on('receiveEdit', function(updatedWorkspace) {
        if ($scope.workspace._id === updatedWorkspace._id) {
            $scope.workspace = updatedWorkspace;
            $scope.$evalAsync();
        }
    });

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
    })

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
    })


    $scope.submit = () => {
        RunTests.submitCode({ code: $scope.theCode })
            .then((returnedValue) => console.log(returnedValue))
            .catch($log.error);
    };



});
