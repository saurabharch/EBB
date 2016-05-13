'use strict';

const mongoose = require('mongoose');
const Promise = require('bluebird');
const chalk = require('chalk');
const connectToDb = require('./server/db');
const User = mongoose.model('User');
const Problem = mongoose.model('Problem');
const Workspace = mongoose.model('Workspace');

let userSeed = [{
    username: 'me',
    email: 'me@me.com',
    password: '123'
}, {
    username: 'me1',
    email: 'me1@me.com',
    password: '123'
}, {
    username: 'me2',
    email: 'me2@me.com',
    password: '123'
}, {
    username: 'me3',
    email: 'me3@me.com',
    password: '123'
}, {
    username: 'me4',
    email: 'me4@me.com',
    password: '123'
}, {
    username: 'me5',
    email: 'me5@me.com',
    password: '123'
}];

let problemSeed = [{
    title: 'Lattice Paths',
    description: 'Given a square grid, how could you determine the number of possible paths from the top left of the grid to the bottom right, assuming you can only move to the right and down?',
    difficulty: 3
}, {
    title: 'Bracket Balancing',
    description: 'One of your colleagues insists on writing all code in Notepad, resulting in code that won\'t run because the brackets, braces, and parenthesis are not properly balanced. You decide to write a bracket validator to check whether the brackets /braces/ parenthesis are valid.',
    difficulty: 4
}];

let workspaceSeed = [{
    name: 'Workspace number A',
    text: 'Blah blah blah'
}, {
    name: 'Workspace number B',
    text: 'Blah blah blah'
}];

const wipeCollections = () => {
    var models = [User, Problem, Workspace];

    return Promise.map(models, function(model) {
        return model.remove({}).exec();
    });
};

const seedDB = () => {
    const randomizeSelector = (array) => {
        var random = Math.floor(Math.random() * array.length);
        var randomSelection = array[random];
        return randomSelection;
    };

    let usersList;

    return User.create(userSeed)
        .then(function(users) {
            usersList = users;
            return Promise.map(users, (user) => {
                let potentialFriends = usersList.filter((member) => user._id !== member._id);
                let randomUser = randomizeSelector(potentialFriends)._id;
                // let randomUser2 = potentialFriends[potentialFriends.findIndex((aFriend)=> aFriend._id === randomUser) % potentialFriends.length + 1]._id;
                user.friends.push(randomUser);
                // user.friends.push(randomUser2);
                return user.save();
            });
        })
        .then((usersWithFriends) => {
            usersList = usersWithFriends;
            workspaceSeed = workspaceSeed.map((workspace) => {
                workspace.creator = randomizeSelector(usersList)._id;
                return workspace;
            });
            return Workspace.create(workspaceSeed);
        })
        .then(() => {
            return Problem.create(problemSeed);
        });
};

connectToDb
    .then(function() {
        return wipeCollections();
    })
    .then(function() {
        return seedDB();
    })
    .then(function() {
        console.log(chalk.green('Seed successful!'));
        process.kill(0);
    })
    .catch(function(err) {
        console.error(err);
        process.kill(1);
    });
