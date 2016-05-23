'use strict';

const Docker = require('dockerode');
const streamBuffers = require('stream-buffers');
// const Promise = require('bluebird');

function DockerRunner () {
    this.docker = new Docker();
    // this.results = {};
}

DockerRunner.prototype.runCommand = function (userCode, testCode) {

    const commands = ['mkdir test', 'cd test', 'touch test.js userCode.js', `echo "'use strict'; module.exports = ${userCode}" >> userCode.js`, `echo "'use strict'; const assert = require('assert'); const userWrittenFunction = require('./userCode'); ${testCode}" >> test.js`, 'mocha --reporter json', 'exit'].join(' && ');

    const stdoutStream = new streamBuffers.WritableStreamBuffer();

    // let results;
    // const callback = function (err, data, container) {
    //     console.log('Running commands', err, data, container);

    //     this.results.stdout = stdoutStream.getContentsAsString('utf8');

    //     container.remove(function (error, response) {
    //         console.log('Removed container', error, response);
    //     });

    //     console.log('Results: ', this.results);
    // };

    // const boundCallback = callback.bind(this);

    // this.docker.run('bgergen/ebb:test2', ['bash', '-c', commands], stdoutStream, boundCallback);

    const results = this.docker.run('bgergen/ebb:test2', ['bash', '-c', commands], stdoutStream, function (err, data, container) {
        console.log('Running commands', err, data, container);

        const resultsInFunc = stdoutStream.getContentsAsString('utf8');

        container.remove(function (error, response) {
            console.log('Removed container', error, response);
        });

        console.log('Results in function: ', resultsInFunc);

        return resultsInFunc;

    });

    console.log('Results to return: ', results);

    return results;

    // console.log('Results round 2: ', this.results.stdout);

    // return this.results.stdout;

    // this.docker.run('bgergen/ebb:test2', ['bash', '-c', ['mkdir test', 'cd test', 'touch test.js userCode.js', `echo "'use strict'; module.exports = function bryan (input) { return input * 2; };" >> userCode.js`, `echo "'use strict'; const assert = require('assert'); const bryan = require('./userCode.js'); describe('bryan function', function () { it('returns twice the value of the input', function () { assert.equal(bryan(42), 84); }); it ('returns triple the value of the input', function () { assert.equal(bryan(10), 30); }); });" >> test.js`, 'mocha --reporter json', 'exit'].join(' && ')], stdoutStream, function (err, data, container) {
    //     // if (err) return callback(err);
    //     console.log('Running commands', err, data, container);

    //     const results = {
    //         stdout: stdoutStream.getContentsAsString('utf8')
    //     };

    //     console.log('Output: ', results.stdout);

    //     container.remove(function (error, response) {
    //         console.log('Removed container', error, response);
    //     });
    // });

};

// const dockerRunner1 = new DockerRunner();

// dockerRunner1.runCommand();

module.exports = DockerRunner;
