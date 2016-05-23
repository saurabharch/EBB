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
        solutionCode: `var paths = {};\nfunction memoizer(x, y, max){\n\tif(paths[[x,y,max]]){\n\t\treturn paths[[x,y,max]];\n\t}\n\telse{\n\t\treturn paths[[x,y,max]] = paths2Bottom(x, y, max);\n\t}\n}\nfunction paths2Bottom(x, y, max){\n\tif (x == max || y == max){\n\t\treturn 1;\n\t}\n\treturn memoizer(x+1, y, max) + memoizer(x, y+1, max);\n}`,
        test: 'console.log(paths2Bottom(0,0,20));',
        testAnswer: '137846528820'
    },
    {
        title: 'Bracket Balancing',
        description: 'Write the "hasBalancedBrackets" function which takes a string. One of your colleagues insists on writing all code in Notepad, resulting in code that won\'t run because the brackets, braces, and parenthesis are not properly balanced. You decide to write a bracket validator to check whether the brackets / braces / parentheses are valid.',
        difficulty: 3,
        solutionCode: `function hasBalancedBrackets(inputStr) {\n\tvar inputBrackets = inputStr.match(/[[\\](){}]/g);\n\t\n\t// if no brackets at all, it's balanced!\n\tif (!inputStr.length || !inputBrackets.length) return true;\n\t\n\tvar bracketPairs = {  \n\t\t'[' : ']',\n\t\t'(' : ')',\n\t\t'{' : '}'\n\t}; \n\t\n\tvar openBrackets = [];\n\t\n\tfor (var i = 0; i < inputBrackets.length; i++) {\n\t  var currBracket = inputBrackets[i];\n\n\t  // if is open bracket\n\t  if ( bracketPairs[currBracket] ) openBrackets.push(currBracket);\n\t  \n\t  // if is closing bracket\n\t  else {\n\t    var bracketToMatch = openBrackets[openBrackets.length - 1];\n\t    \n\t    // right closing brace, yay!\n\t    if (bracketPairs[bracketToMatch] === currBracket) openBrackets.pop();\n\t    // wrong closing brace, boo!\n\t    else return false;\n\t  }\n\t}\n\t\n\treturn !openBrackets.length;\n}`,
        test: 'console.log(hasBalancedBrackets("(){}[]"), hasBalancedBrackets("(){(}[]"));',
        testAnswer: 'true false'
    },
    {
        title: 'Sieve of Eratosthenes',
        description: 'Write the "Erat" function which takes a number and that uses the Sieve of Eratosthenes to find the sum of all the primes from 2 up to a given number.',
        difficulty: 5,
        solutionCode: `function Erat(max){\n\t//Step 1\n\tvar primes = []\n\tfor (i=0; i< max; i++){\n\t\tprimes.push(true)\n\t}\n\t//Step 2\n\tfor(var x=2; x<primes.length; x++){\n\t\tvar multiple = x\n\t\twhile(multiple < max){\n\t\t\tmultiple += x\n\t\t\tif(primes[multiple-1]){\n\t\t\t\tprimes[multiple-1] = false\n\t\t\t}\n\t\t}\t\n\t}\n        //Step 3\n\tvar sum = 0\n\tprimes.forEach(function(prime, idx, array){\n\t\tif(idx==1){\n\t\t\tsum -= 1\n\t\t}\n\t\tif(prime){\n\t\t\tsum += idx+1\n\t\t}\n\t})\n\treturn sum\n}`,
        test: 'console.log(Erat(2000000));',
        testAnswer: '142913828922'
    },
    {
        title: 'Multi-Dimensional Array Sum',
        description: 'Write the "mdArraySum" function which takes an array. You have an array that consists of subarrays that are of varying length. Write a function to find the sum of each element in the array. You may not use any Array methods such as reduce (the only Array method you can use is for checking the type of an element).',
        difficulty: 1,
        solutionCode: `function mdArraySum(arr) {\n  var sum = 0;\n    for (var i = 0; i < arr.length ;  i++) {\n        if (Array.isArray(arr[i])) {\n            sum += mdArraySum(arr[i]);\n        } else {\n            sum += arr[i];\n        }\n    }\n    return sum;\n}`,
        test: 'console.log(mdArraySum([ 2, [3,4], 5, [-3, [6 , [ 4,5 ] ] ] ]));',
        testAnswer: '26'
    },
    {
        title: 'Memoization',
        description: 'Write the "fibonacci" function which takes a number. Use memoization to improve the efficiency of a recursive solution to find the nth number in the Fibonacci sequence.',
        difficulty: 3,
        solutionCode: `var fibonacciTable = [0, 1, 1]\n\nfunction fibonacci(num){  \n    if(num > 2){\n        if(!fibonacciTable[num-1]) fibonacciTable[num-1] = fibonacci(num-1);\n        if(!fibonacciTable[num-2]) fibonacciTable[num-2] = fibonacci(num-2);\n        return fibonacciTable[num-1] + fibonacciTable[num-2];\n    }\n    else if(num <= 1) return num;\n    else return 1;\n}`,
        test: 'console.log(fibonacci(1000));',
        testAnswer: '4.346655768693743e+208'
    },
    {
        title: 'String Permutations',
        description: 'Write the "permute" function which takes a string. Given a string, return an array of all the permutations of that string. The permutations of the string should be the same length as the original string (i.e. use each letter in the string exactly once) but do not need to be actual words.',
        difficulty: 5,
        solutionCode: `function permute(str) {\n    const permutations = [];\n\t\n    function getPerms(str, rest) {\n        // BASE CASE: push the new permutation into the permutations array\n        // unless the same string is already there\n\tif (!str.length && permutations.indexOf(rest) > -1) return; \n\telse if (!str.length) return permutations.push(rest);\n\t\t\n\t// RECURSIVE CASE: for each character in the string...\n\tstr.split('').forEach((currentChar, idx) => {\n\t    // ...take that character out of the string...\n\t    let strWithoutCurrentChar = str.slice(0, idx) + str.slice(idx + 1);\n\t    // ...and add it to the beginning of the rest of the current permutation\n\t    getPerms(strWithoutCurrentChar, currentChar + rest);\n\t});\n    }\n\t\n    getPerms(str, '');\n    return permutations;\n}`,
        test: 'console.log(stringPermutations("app"));',
        testAnswer: '["app","pap","ppa"]'
    },
    {
        title: 'Maximum Subarray Problem',
        description: 'Write the "maxSub" function which takes an array. Given an array of integers, find a contiguous subarray that sums to the greatest value.',
        difficulty: 4,
        solutionCode: `function maxSub(array){\n    var curr = 0, prev = 0;\n    var start=0, end=0;\n    var maxStart,maxEnd;\n    for (var i=0; i < array.length; i++){\n        if (0 >= prev+array[i]){\n            prev = 0;\n            start = i+1;\n            end = i+1;\n        } else {\n            prev = prev + array[i];\n            end = i+1;\n        }\n        if (prev > curr){\n            maxStart = start;\n            maxEnd = end;\n            curr = prev;\n        } \n    }\n    return array.slice(maxStart,maxEnd);\n}`,
        test: 'console.log(maxSub([−2, 1, −3, 4, −1, 2, 1, −5, 4]));',
        testAnswer: '[4,-1,2,1]'
    },
    {
        title: 'Decimal/Binary Conversion',
        description: 'Write 2 functions, one ("decimalToBinary") that takes the a number in base 10 (decimal) and converts it to the string representation of that number in base 2 (binary), and one that converts back ("binaryToDecimal").',
        difficulty: 2,
        solutionCode: `function decimalToBinary(num) {\n    if (!num) return \"\";\n    return decimalToBinary(Math.floor(num/2)) + num%2;   \n}\n\nfunction binaryToDecimal(numStr) {\n    if (!numStr.length) return 0;\n    return binaryToDecimal(numStr.slice(0, -1))*2 \n        + Number(numStr[numStr.length-1]);\n}`,
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
