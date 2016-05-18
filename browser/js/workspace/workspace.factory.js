'use strict';

app.factory('WorkspaceFactory', function($http) {
    const WorkspaceFactory = {};

    function getData(res) {
        return res.data;
    }

    WorkspaceFactory.createWorkspace = function(workspaceInfo) {
        return $http.post('/api/workspace', workspaceInfo)
            .then(getData)
            .then(function(workspace) {
                return workspace;
            });
    };

    WorkspaceFactory.getWorkspaceById = function(workspaceId) {
        return $http.get('/api/workspace/' + workspaceId)
            .then(getData)
            .then(function(workspace) {
                return workspace;
            });
    };

    WorkspaceFactory.getUserWorkspaces = function(userId) {
        return $http.get('/api/workspace/user/' + userId)
            .then(getData)
            .then(function(workspaces) {
                return workspaces;
            });
    };

    WorkspaceFactory.saveWorkspace = function(workspace) {
        return $http.put('/api/workspace/' + workspace._id, workspace)
            .then(getData)
            .then(function(savedWorkspace) {
                return savedWorkspace;
            });
    }

    WorkspaceFactory.deleteWorkspace = function (workspaceId) {
        return $http.delete('/api/workspace/' + workspaceId)
            .then(function(res) {
                return res.status;
            });
    }

    return WorkspaceFactory;

});
