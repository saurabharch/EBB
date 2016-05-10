'use strict';

const Docker = require('dockerode/lib/docker');
const fs = require('fs');

const dockerHelper = () => {

    console.log('inside docker-helper function');

    // Instantiates docker
    const docker = new Docker({
        protocol: 'https',
        host: 'https://localhost:1337',
        port: process.env.DOCKER_PORT || 2375,
        cert: fs.readFileSync(__dirname + '/../../../../cert.pem'),
        key: fs.readFileSync(__dirname + '/../../../../key.pem')
    });

    // let containerId;
    docker.run('new Image', ['-d'], [process.stdout, process.stderr], { Tty: false }, (err, data, container) => {
        console.log('Data: ', data);
        console.log('Container: ', container);
        console.log('stdout: ', process.stdout);
        // containerId = process.stdout;
    }).on('container', (containerObj) => {
        console.log(containerObj);
    });

    return docker;

};

module.exports = dockerHelper;
