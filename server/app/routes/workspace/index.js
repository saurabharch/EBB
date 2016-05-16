var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');
var Workspace = mongoose.model('Workspace');

router.post('/', function(req, res, next) {
    Workspace.create(req.body)
        .then(function(workspace) {
            res.send(workspace);
        })
        .catch(next);
});

router.get('/:workspaceId', function(req, res, next) {
    Workspace.findById(req.params.workspaceId)
        .populate('creator collaborator problemId')
        .then(function(workspace) {
            res.send(workspace);
        })
        .catch(next);
})

router.put('/:workspaceId', function(req, res, next) {
    Workspace.findById(req.params.workspaceId)
        .then(function(workspace) {
            workspace.text = req.body.text || workspace.text;
            workspace.collaborator = req.body.collaborator || workspace.collaborator;
            return workspace.save();
        })
        .then(function() {
            return Workspace.findById(req.params.workspaceId)
                .populate('creator collaborator');
        })
        .then(function(workspace) {
            res.send(workspace);
        })
        .catch(next);
})

router.delete('/:workspaceId', function(req, res, next) {
    Workspace.remove({_id: req.params.workspaceId})
        .then(function() {
            res.sendStatus(204);
        })
        .catch(next);
})

router.get('/user/:userId', function(req, res, next) {
    Workspace.find({
            $or: [{ creator: req.params.userId }, { collaborator: req.params.userId }],
            scenarioType: 'workspace'
        })
        .populate('creator collaborator')
        .then(function(workspaces) {
            res.send(workspaces);
        })
        .catch(next);
});
