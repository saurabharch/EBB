'use strict';

app.config(function($stateProvider) {
    $stateProvider.state('workspaceMain', {
        url: '/workspace/:workspaceId',
        templateUrl: 'js/workspace/workspace-main.html',
        controller: 'WorkspaceMainCtrl',
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
