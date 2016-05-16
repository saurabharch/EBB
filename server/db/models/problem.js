'use strict';
var mongoose = require('mongoose');

var problem = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    problemCode: {
        type: String,
        // required: true
    },
    difficulty: {
        type: Number // we gotta decide on a ranking system
    },
    tests: {
        type: String
        // required: true
    },
    solution: {
        type: String
    }
});

mongoose.model('Problem', problem);
