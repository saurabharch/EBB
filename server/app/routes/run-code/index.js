'use strict';

const router = require('express').Router();
const DockerRunner = require('../../dockerrunner.js');
module.exports = router;

router.post('/', ({ body }, res, next) => {

    const docker = new DockerRunner();

    docker.runCommand(body.userCode, body.testCode)
    .then((results) => res.json(results))
    .catch(next);

});
