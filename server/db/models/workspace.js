'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    scenarioType: {
        type: String,
        enum: ['workspace', 'interview', 'solve'],
        required: true
    },
    name: {
        type: String,
        required: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    collaborator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    problem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem'
    },
    text: {
        type: String,
        default: ''
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    dateLastModified: {
        type: Date,
        default: Date.now
    },
    problemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem'
    },
    solved: {
        type: Boolean
    }
});

schema.pre('save', function (next) {
    this.dateLastModified = Date.now();
    next();
});

mongoose.model('Workspace', schema);
