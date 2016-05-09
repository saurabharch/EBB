'use strict';
var mongoose = require('mongoose');

var problem = new mongoose.Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    difficulty: {
        type: Number // we gotta decide on a ranking system
    },
    tests: {
        type: String
    }
});

mongoose.model('Problem', problem);
