'use strict';

app.factory('VideoChatFactory', function($http, Socket) {
    const VideoChatFactory = {};
    let session;
    let sessionApiKey;
    let sessionId;
    let sessionToken;

    function getData(res) {
        return res.data;
    }

    function getOpenTokCreds() {
        return $http.get('/getSession')
            .then(getData);
    }

    VideoChatFactory.initiateVideoChat = (toUser, fromUser) => {
        return getOpenTokCreds()
            .then(function(res) {
                sessionApiKey = res.apiKey;
                sessionId = res.sessionId;
                sessionToken = res.token;
                Socket.emit('sendVideoChatOffer', toUser, fromUser, sessionApiKey, sessionId);
            });
    };

    Socket.on('receiveVideoChatOffer', (toUser, fromUser, apiKey, sessId) => {
        sessionApiKey = apiKey;
        sessionId = sessId;
    });

    VideoChatFactory.getTokens = () => {
        return $http.get('/getToken/' + sessionApiKey + '/' + sessionId)
            .then(getData)
            .then((tokens) => {
                sessionToken = tokens.token;
            });
    };

    VideoChatFactory.commenceVideoChat = () => {
        session = OT.initSession(sessionApiKey, sessionId);

        // Subscribe to a newly created stream
        session.on('streamCreated', (event) => {
            session.subscribe(event.stream, 'subscriber', {
                insertMode: 'append',
                width: '100%',
                height: '100%'
            });
        });

        session.on('sessionDisconnected', (event) => {
            console.log('You were disconnected from the session.', event.reason);
        });

        session.on('connectionDestroyed', () => {
            session.disconnect();
        });

        // Connect to the session
        session.connect(sessionToken, (error) => {
            // If the connection is successful, initialize a publisher and publish to the session
            if (!error) {
                let publisher = OT.initPublisher('publisher', {
                    insertMode: 'append',
                    width: '100%',
                    height: '100%'
                });
                session.publish(publisher);
            } else {
                console.log('There was an error connecting to the session: ', error.code, error.message);
            }
        });
    };

    VideoChatFactory.stopVideoChat = (toUser, fromUser) => {
        session.disconnect();
        Socket.emit('stoppedVideoChat', toUser, fromUser);
    };

    return VideoChatFactory;
});
