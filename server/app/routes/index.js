'use strict';
var router = require('express').Router();
module.exports = router;

router.use('/members', require('./members'));
router.use('/runcode', require('./run-code'));
router.use('/users', require('./users'));
router.use('/problems', require('./problems'));
router.use('/comments', require('./comments'));
// router.use('/userstats', require('./userStats'));

// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
    res.status(404).end();
});
