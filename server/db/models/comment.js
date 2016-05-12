'use strict';

import mongoose, { Schema } from 'mongoose';

const commentSchema = new mongoose.Schema({
    problem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    video: String,
    upvotes: {
        type: Number,
        default: 0
    }
});

mongoose.model('Comment', commentSchema);
