'use strict';

const Docker = require('dockerode');
const streamBuffers = require('stream-buffers');
const Promise = require('bluebird');

function DockerRunner () {
    this.docker = new Docker();
}

DockerRunner.prototype.runCommand = function (userCode, testCode, scenario) {

    const userCodeEdited = userCode.replace(/'/gm, '"');

    let commands;
    if (scenario === 'workspace') {
        commands = ['touch userCode.js', `node -p '${userCodeEdited}'`, 'exit'].join(' && ');
    } else {
        commands = ['mkdir test', 'cd test', 'touch test.js', `echo "'use strict'; const assert = require('assert'); ${userCode}; ${testCode}" >> test.js`, 'mocha --reporter json', 'exit'].join(' && ');
    }

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
