'use strict';

import mongoose, { Schema } from 'mongoose';

const userStatsSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    problems: {
        type: [Schema.Types.ObjectId],
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

// const handleError = console.error.bind(console);

mongoose.model('UserStats', userStatsSchema);
