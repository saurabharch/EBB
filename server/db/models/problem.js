'use strict';
var mongoose = require('mongoose');

var problem = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    difficulty: {
        type: Number,
        min: 0,
        max: 5
    },
    solutionCode: {
        type: [String],
        required: true
    },
    solutionVideo: {
        type: String,
        // required: true
    },
    test: {
        type: String,
        required: true
    },
    testAnswer: {
        type: String,
        required: true
    }
});

mongoose.model('Problem', problem);
