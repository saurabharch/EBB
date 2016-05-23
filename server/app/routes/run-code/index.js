'use strict';

const router = require('express').Router();
// const https = require('https');
// const enviro = require('../../../env');
const DockerRunner = require('../../dockerrunner.js');
module.exports = router;

router.post('/', ({ body }, res, next) => {
    console.log(`User-entered Code: ${body.userCode}`);
    console.log(`Test Code: ${body.testCode}`);

    const docker = new DockerRunner();

    // console.log(`Results: ${docker.runCommand(body.userCode, body.testCode)}`);

    res.send(docker.runCommand(body.userCode, body.testCode));
    // .then(() => console.log('Results in route: ', docker.results));
    // res.send(docker.results.stdout);

    next();

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
//             'Authorization': `Token ${glotConfig.apiToken}`,
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
