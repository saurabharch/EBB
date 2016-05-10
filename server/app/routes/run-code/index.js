'use strict';

const router = require('express').Router();
// const https = require('https');
// const Docker = require('dockerode/lib/docker');
const fs = require('fs');
const enviro = require('../../../env');
const helperFunc = require('./docker-helper.js');
module.exports = router;

// const dockerHelper = () => {

//     console.log('inside docker-helper function');

//     // Instantiates docker
//     const docker = new Docker({
//         protocol: 'https',
//         host: 'https://localhost:1337',
//         port: process.env.DOCKER_PORT || 2375,
//         cert: fs.readFileSync(__dirname + '/../../../../cert.pem'),
//         key: fs.readFileSync(__dirname + '/../../../../key.pem')
//     });

//     // let containerId;
//     docker.run('new Image', ['bash', '-d'], [process.stdout, process.stderr], { Tty: false }, (err, data, container) => {
//         console.log('Data: ', data);
//         console.log('Container: ', container);
//         console.log('stdout: ', process.stdout);
//         // containerId = process.stdout;
//     });

//     return docker;

// };

router.post('/', ({ body }, res, next) => {
    console.log('hitting the route');
    return helperFunc();
    // console.log('just ran the route');
});

// router.post('/', ({ body }, res) => {
//     const glotConfig = enviro.GLOT;

//     const postData = JSON.stringify({
//         'files': [
//             {
//                 'name': 'main.js',
//                 'content': body.code
//             }
//         ]
//     });

//     const options = {
//         protocol: 'https:',
//         host: 'run.glot.io',
//         method: 'POST',
//         path: '/languages/javascript/latest',
//         headers: {
//             'Authorization': `Token ${ glotConfig.apiToken }`,
//             'Content-type': 'application/json'
//         }
//     };

//     const req = https.request(options, (resBack) => {
//         resBack.on('data', (chunk) => {
//             res.send(chunk);
//         });
//     });

//     req.end(postData);
// });
