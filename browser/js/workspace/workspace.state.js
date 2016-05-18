'use strict';

app.config(function($stateProvider) {
    $stateProvider.state('workspace', {
        url: '/workspace',
        templateUrl: 'js/workspace/workspace.html',
        controller: 'WorkspaceCtrl',
        resolve: {
            user: function(AuthService) {
                return AuthService.getLoggedInUser();
            },
            workspaces: function(WorkspaceFactory, AuthService) {
                return AuthService.getLoggedInUser()
                    .then(function(user) {
                        return WorkspaceFactory.getUserWorkspaces(user._id);
                    });
            }
        }
    });
});
