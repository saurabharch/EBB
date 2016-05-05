'use strict';
const OpenTok = require('opentok');

module.exports = function(app) {
    const opentokConfig = app.getValue('env').OPENTOK;
    const apiKey = opentokConfig.apiKey;
    const apiSecret = opentokConfig.apiSecret;

    // Initialize OpenTok
    const opentok = new OpenTok(apiKey, apiSecret);

    app.get('/getSession', function(req, res) {
        // Create a session
        opentok.createSession({ mediaMode: "routed" }, function(err, session) {
            if (err) throw err;

            const sessionId = session.sessionId;
            const token = opentok.generateToken(sessionId);

            res.send({
                apiKey: apiKey,
                sessionId: sessionId,
                token: token
            });
        });
    });

    app.get('/getToken/:apiKey/:sessionId', function(req, res) {
        res.send({
            apiKey: req.params.apiKey,
            sessionId: req.params.sessionId,
            token: opentok.generateToken(req.params.sessionId)
        });
    });

    // app.post('/startArchiving', function(req, res) {
    //     const sessionId = req.body.sessionId;

    //     const archiveOptions = {
    //         name: 'Important Presentation',
    //         outputMode: 'individual'
    //     };

    //     opentok.startArchive(sessionId, archiveOptions, function(err, archive) {
    //         if (err) {
    //             return console.log(err);
    //         } else {
    //             // The id property is useful to save off into a database
    //             console.log("new archive:" + archive.id);
    //         }
    //     });
    // });

    // app.post('/stopArchiving', function(req, res) {
    //     const archiveId = req.body.archiveId;

    //     opentok.stopArchive(archiveId, function(err, archive) {
    //         if (err) {
    //             return console.log(err);
    //         } else {
    //             // The id property is useful to save off into a database
    //             console.log("Stopped archive:" + archive.id);
    //         }
    //     });
    // });

};
