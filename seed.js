'use strict';

const mongoose = require('mongoose');
const Promise = require('bluebird');
const chalk = require('chalk');
const connectToDb = require('./server/db');
const User = mongoose.model('User');
const Problem = mongoose.model('Problem');
const Workspace = mongoose.model('Workspace');

let userSeed = [{
    username: 'Bryan',
    email: 'bryan@me.com',
    password: '123'
}, {
    username: 'Brian',
    email: 'brian@me.com',
    password: '123'
}, {
    username: 'Edward',
    email: 'edward@me.com',
    password: '123'
}, {
    username: 'Alice',
    email: 'alice@me.com',
    password: '123'
}, {
    username: 'Bob',
    email: 'bob@me.com',
    password: '123'
}, {
    username: 'Charlie',
    email: 'charlie@me.com',
    password: '123'
}];

let problemSeed = [
    {
        title: 'Lattice Paths',
        description: 'Write the "paths2Bottom" function which takes a starting x coordinate, starting y coordinate and the length of the grid. Given a square grid, how could you determine the number of possible paths from the top left of the grid to the bottom right, assuming you can only move to the right and down? Example: a 2 by 2 grid has 6 possible paths.',
        difficulty: 4,
        solutionCode: ["var paths = {};", "function memoizer(x, y, max){", "    if(paths[[x,y,max]]){", "        return paths[[x,y,max]];", "    }", "    else{", "        return paths[[x,y,max]] = paths2Bottom(x, y, max);", "    }", "}", "function paths2Bottom(x, y, max){", "    if (x == max || y == max){", "        return 1;", "    }", "    return memoizer(x+1, y, max) + memoizer(x, y+1, max);", "}"],
        // test: 'console.log(paths2Bottom(0,0,20));',
        test: `describe('the paths2Bottom function', function () { it('test1', function () { assert.equal(paths2Bottom(0,0,5), 252); }); it('test2', function () { assert.equal(paths2Bottom(0,0,10), 184756); }); it('test3', function () { assert.equal(paths2Bottom(0,0,20), 137846528820); }); });`,
        testAnswer: '137846528820'
    },
    {
        title: 'Bracket Balancing',
        description: 'Write the "hasBalancedBrackets" function which takes a string. One of your colleagues insists on writing all code in Notepad, resulting in code that won\'t run because the brackets, braces, and parenthesis are not properly balanced. You decide to write a bracket validator to check whether the brackets / braces / parentheses are valid.',
        difficulty: 3,
        solutionCode: ["function hasBalancedBrackets(inputStr) {", "    var inputBrackets = inputStr.match(/[[](){}]/g);", "", "    // if no brackets at all, it's balanced!", "    if (!inputStr.length || !inputBrackets.length) return true;", "", "    var bracketPairs = {", "        '[' : ']',", "        '(' : ')',", "        '{' : '}'", "    };", "", "    var openBrackets = [];", "", "    for (var i = 0; i < inputBrackets.length; i++) {", "      var currBracket = inputBrackets[i];", "", "      // if is open bracket", "      if ( bracketPairs[currBracket] ) openBrackets.push(currBracket);", "", "      // if is closing bracket", "      else {", "        var bracketToMatch = openBrackets[openBrackets.length - 1];", "", "        // right closing brace, yay!", "        if (bracketPairs[bracketToMatch] === currBracket) openBrackets.pop();", "        // wrong closing brace, boo!", "        else return false;", "      }", "    }", "", "    return !openBrackets.length;", "}"],
        test: 'console.log(hasBalancedBrackets("(){}[]"), hasBalancedBrackets("(){(}[]"));',
        testAnswer: 'true false'
    },
    {
        title: 'Sieve of Eratosthenes',
        description: 'Write the "Erat" function which takes a number and that uses the Sieve of Eratosthenes to find the sum of all the primes from 2 up to a given number.',
        difficulty: 5,
        solutionCode: ["function Erat(max){", "    //Step 1", "    var primes = []", "    for (i=0; i< max; i++){", "        primes.push(true)", "    }", "    //Step 2", "    for(var x=2; x<primes.length; x++){", "        var multiple = x", "        while(multiple < max){", "            multiple += x", "            if(primes[multiple-1]){", "                primes[multiple-1] = false", "            }", "        }", "    }", "        //Step 3", "    var sum = 0", "    primes.forEach(function(prime, idx, array){", "        if(idx==1){", "            sum -= 1", "        }", "        if(prime){", "            sum += idx+1", "        }", "    })", "    return sum", "}"],
        test: 'console.log(Erat(2000000));',
        testAnswer: '142913828922'
    },
    {
        title: 'Multi-Dimensional Array Sum',
        description: 'Write the "mdArraySum" function which takes an array. You have an array that consists of subarrays that are of varying length. Write a function to find the sum of each element in the array. You may not use any Array methods such as reduce (the only Array method you can use is for checking the type of an element).',
        difficulty: 1,
        solutionCode: ["function mdArraySum(arr) {", "  var sum = 0;", "    for (var i = 0; i < arr.length ;  i++) {", "        if (Array.isArray(arr[i])) {", "            sum += mdArraySum(arr[i]);", "        } else {", "            sum += arr[i];", "        }", "    }", "    return sum;", "}"],
        test: 'console.log(mdArraySum([ 2, [3,4], 5, [-3, [6 , [ 4,5 ] ] ] ]));',
        testAnswer: '26'
    },
    {
        title: 'Memoization',
        description: 'Write the "fibonacci" function which takes a number. Use memoization to improve the efficiency of a recursive solution to find the nth number in the Fibonacci sequence.',
        difficulty: 3,
        solutionCode: ["var fibonacciTable = [0, 1, 1]", "function fibonacci(num){  ", "    if(num > 2){", "        if(!fibonacciTable[num-1]) fibonacciTable[num-1] = fibonacci(num-1);", "        if(!fibonacciTable[num-2]) fibonacciTable[num-2] = fibonacci(num-2);", "        return fibonacciTable[num-1] + fibonacciTable[num-2];", "    }", "    else if(num <= 1) return num;", "    else return 1;", "}"],
        test: 'console.log(fibonacci(1000));',
        testAnswer: '4.346655768693743e+208'
    },
    {
        title: 'String Permutations',
        description: 'Write the "permute" function which takes a string. Given a string, return an array of all the permutations of that string. The permutations of the string should be the same length as the original string (i.e. use each letter in the string exactly once) but do not need to be actual words.',
        difficulty: 5,
        solutionCode: ["function permute(str) {", "    const permutations = [];", " ", "    function getPerms(str, rest) {", "        // BASE CASE: push the new permutation into the permutations array", "        // unless the same string is already there", "  if (!str.length && permutations.indexOf(rest) > -1) return; ", "    else if (!str.length) return permutations.push(rest);", "       ", "    // RECURSIVE CASE: for each character in the string...", "  str.split('').forEach((currentChar, idx) => {", "       // ...take that character out of the string...", "      let strWithoutCurrentChar = str.slice(0, idx) + str.slice(idx + 1);", "     // ...and add it to the beginning of the rest of the current permutation", "        getPerms(strWithoutCurrentChar, currentChar + rest);", "    });", "    }", "    ", "    getPerms(str, '');", "    return permutations;", "}"],
        test: 'console.log(stringPermutations("app"));',
        testAnswer: '["app","pap","ppa"]'
    },
    {
        title: 'Maximum Subarray Problem',
        description: 'Write the "maxSub" function which takes an array. Given an array of integers, find a contiguous subarray that sums to the greatest value.',
        difficulty: 4,
        solutionCode: ["function maxSub(array){", "    var curr = 0, prev = 0;", "    var start=0, end=0;", "    var maxStart,maxEnd;", "    for (var i=0; i < array.length; i++){", "        if (0 >= prev+array[i]){", "            prev = 0;", "            start = i+1;", "            end = i+1;", "        } else {", "            prev = prev + array[i];", "            end = i+1;", "        }", "        if (prev > curr){", "            maxStart = start;", "            maxEnd = end;", "            curr = prev;", "        } ", "    }", "    return array.slice(maxStart,maxEnd);", "}"],
        test: 'console.log(maxSub([−2, 1, −3, 4, −1, 2, 1, −5, 4]));',
        testAnswer: '[4,-1,2,1]'
    },
    {
        title: 'Decimal/Binary Conversion',
        description: 'Write 2 functions, one ("decimalToBinary") that takes the a number in base 10 (decimal) and converts it to the string representation of that number in base 2 (binary), and one that converts back ("binaryToDecimal").',
        difficulty: 2,
        solutionCode: ["function decimalToBinary(num) {", "    if (!num) return '';", "    return decimalToBinary(Math.floor(num / 2)) + num % 2;", "}", "function binaryToDecimal(numStr) {", "    if (!numStr.length) return 0;", "    return binaryToDecimal(numStr.slice(0, -1)) * 2 + Number(numStr[numStr.length - 1]);", "}"],
        test: 'console.log(decimalToBinary(203), binaryToDecimal("11001011"));',
        testAnswer: '11001011 203'
    }
];

let workspaceSeed = [{
    name: 'Workspace number A',
    text: 'Blah blah blah',
    scenarioType: 'workspace'
}, {
    name: 'Workspace number B',
    text: 'Blah blah blah',
    scenarioType: 'workspace'
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
