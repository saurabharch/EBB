app.config(function($stateProvider) {

    $stateProvider.state('videoexample', {
        url: '/videoexample',
        templateUrl: 'js/video-example/video-example.html',
        controller: 'VideoExampleCtrl',
        resolve: {
            currentUser: function (AuthService) {
                return AuthService.getLoggedInUser();
            }
        }
    });
});

app.controller('VideoExampleCtrl', function($scope, VideoExampleFactory, LoggedInUsersFactory, currentUser, Socket, $log) {
    let session;
    let sessionToken;
    let archive;
    function initializeSession(apiKey, sessionId, token) {
        session = OT.initSession(apiKey, sessionId);

        // Subscribe to a newly created stream
        session.on('streamCreated', function(event) {
            session.subscribe(event.stream, 'subscriber', {
                insertMode: 'append',
                width: '100%',
                height: '100%'
            });
        });

        session.on('sessionDisconnected', function(event) {
            console.log('You were disconnected from the session.', event.reason);
        });

        // Connect to the session
        session.connect(token, function(error) {
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
    }

    $scope.currentUser = currentUser;

    $scope.loggedInUsers = LoggedInUsersFactory.getLoggedInUsers();

    $scope.makeOffer = function (targetUser) {
        VideoExampleFactory.getOpenTokCreds()
            .then(function(res) {
                const sessionApiKey = res.apiKey;
                const sessionSessionId = res.sessionId;
                sessionToken = res.token;

                Socket.emit('sendOffer', sessionApiKey, sessionSessionId, targetUser, LoggedInUsersFactory.getLoggedInUsers()[currentUser.username]);
            })
            .catch($log.error);
    };

    $scope.acceptOffer = function (initiatingUser) {
        initializeSession(initiatingUser.tokens.apiKey, initiatingUser.tokens.sessionId, initiatingUser.tokens.token);
        Socket.emit('acceptOffer', initiatingUser);
    };

    Socket.on('offerAccepted', function(tokens) {
        initializeSession(tokens.apiKey, tokens.sessionId, sessionToken);
    });

    $scope.disconnect = function() {
        session.disconnect();
    };

    $scope.startRecording = function () {
        // VideoExampleFactory.startArchiving(session)
        // .then(function(archive) {
        //     console.log('archive', archive);
        //     archive = archive;
        // })
        // .catch($log.error);
    };

    $scope.stopRecording = function () {
        // VideoExampleFactory.stopArchiving(archive)
        // .then(function() {
        //     console.log('stopped recording');
        // })
        // .catch($log.error);
    };
});

app.factory('VideoExampleFactory', function($http, Socket) {
    const VideoExampleFactory = {};

    function getData(res) {
        return res.data;
    }

    VideoExampleFactory.getOpenTokCreds = function() {
        return $http.get('/getSession')
            .then(getData);
    };

    // VideoExampleFactory.startArchiving = function(session) {
    //     return $http.post('/startArchiving', session)
    //         .then(getData);
    // };

    // VideoExampleFactory.stopArchiving = function(archive) {
    //     return $http.post('/startArchiving', archive)
    //         .then(getData);
    // };

    return VideoExampleFactory;
});
