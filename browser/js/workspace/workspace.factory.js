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

    WorkspaceFactory.getUserInterviews = function(userId) {
    return $http.get('/api/workspace/user/' + userId + '/interviews')
        .then(getData)
        .then(function(interviews) {
            return interviews;
        });
    };

    WorkspaceFactory.getUserSolves = function(userId) {
    return $http.get('/api/workspace/user/' + userId + '/solves')
        .then(getData)
        .then(function(solves) {
            return solves;
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
