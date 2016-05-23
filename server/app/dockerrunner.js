'use strict';

const Docker = require('dockerode');
const streamBuffers = require('stream-buffers');
const Promise = require('bluebird');

function DockerRunner () {
    this.docker = new Docker();
}

DockerRunner.prototype.runCommand = function (userCode, testCode) {

    const commands = ['mkdir test', 'cd test', 'touch test.js userCode.js', `echo "'use strict'; module.exports = ${userCode}" >> userCode.js`, `echo "'use strict'; const assert = require('assert'); const userWrittenFunction = require('./userCode'); ${testCode}" >> test.js`, 'mocha --reporter json', 'exit'].join(' && ');

    const stdoutStream = new streamBuffers.WritableStreamBuffer();

    const finishedPromise = new Promise((resolve, reject) => {
        this.docker.run('bgergen/ebb:test2', ['bash', '-c', commands], stdoutStream, function(err, data, container) {
            if (err) return reject(err);

            const results = stdoutStream.getContentsAsString('utf8');

            container.remove(function (error, response) {
                if (error) console.log(error);
            });

            resolve(results);
        });
    });

    return finishedPromise;

};

module.exports = DockerRunner;
