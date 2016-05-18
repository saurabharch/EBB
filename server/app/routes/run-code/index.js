'use strict';

const router = require('express').Router();
const https = require('https');
const enviro = require('../../../env');
module.exports = router;

router.post('/', ({ body }, res) => {
    const glotConfig = enviro.GLOT;

    const postData = JSON.stringify({
        'files': [
            {
                'name': 'main.js',
                'content': body.code
            }
        ]
    });

    const options = {
        protocol: 'https:',
        host: 'run.glot.io',
        method: 'POST',
        path: '/languages/javascript/latest',
        headers: {
            'Authorization': `Token ${glotConfig.apiToken}`,
            'Content-type': 'application/json'
        }
    };

    const req = https.request(options, (resBack) => {
        resBack.on('data', (chunk) => {
            res.send(chunk);
        });
    });

    req.end(postData);
});
