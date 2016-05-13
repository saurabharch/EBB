'use strict';

const mongoose = require('mongoose');

const userStatsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    problems: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Problem',
        progress: {
            type: String,
            enum: ['completed', 'attempted', 'not attempted']
        },
        required: true
    },
    skillLevel: {
        type: Number,
        default: 1
    },
    lastActive: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('UserStats', userStatsSchema);
