var mongoose = require('mongoose');
var Promise = require('bluebird');
var chalk = require('chalk');
var connectToDb = require('./server/db');
var User = mongoose.model('User');
var Problem = mongoose.model('Problem');

var wipeCollections = function () {
    var removeUsers = User.remove({});
    var removeProblems = Problem.remove({});
    return Promise.all([
        removeUsers,
        removeProblems
    ]);
};

var seedProblems = function(){
  var problems = [
      {
          title: 'Lattice Paths',
          description: 'Given a square grid, how could you determine the number of possible paths from the top left of the grid to the bottom right, assuming you can only move to the right and down?',
          difficulty: 3
      },
      {
          title: 'Bracket Balancing',
          description: 'One of your colleagues insists on writing all code in Notepad, resulting in code that won\'t run because the brackets, braces, and parenthesis are not properly balanced. You decide to write a bracket validator to check whether the brackets /braces/ parenthesis are valid.',
          difficulty: 4
      }
  ];

  return Problem.create(problems);
};

var seedUsers = function () {

    var users = [
        {
            username: 'me',
            email: 'me@me.com',
            password: '123'
        },
        {
            username: 'me1',
            email: 'me1@me.com',
            password: '123'
        }
    ];

    return User.create(users);

};

connectToDb
    .then(function () {
        return wipeCollections();
    })
    .then(function () {
        return seedUsers();
    })
    .then(function(){
        return seedProblems();
    })
    .then(function () {
        console.log(chalk.green('Seed successful!'));
        process.kill(0);
    })
    .catch(function (err) {
        console.error(err);
        process.kill(1);
    });
