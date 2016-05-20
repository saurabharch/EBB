'use strict';

app.controller('ProgrammingPageCtrl', function($scope, ProgrammingPageFactory, LoggedInUsersFactory, RunTests, currentUser, Socket, $log, $stateParams) {
    let partnerUser = $stateParams.partnerUser;
    let session;
    let sessionToken;

    // Depending on whether the client made the offer to pair, either make the offer or accept the offer for OpenTok
    if ($stateParams.offeror) {
      console.log('offeror is true')
        ProgrammingPageFactory.getOpenTokCreds()
            .then(function(res) {
              console.log('ProgrammingPageCtrl res', res)
                const sessionApiKey = res.apiKey;
                const sessionSessionId = res.sessionId;
                sessionToken = res.token;
                console.log('about to sendOffer, partner and current user', partnerUser, currentUser)
                Socket.emit('sendOffer', sessionApiKey, sessionSessionId, partnerUser, LoggedInUsersFactory.getLoggedInUsers()[currentUser.username]);
            })
            .catch($log.error);
    } else {
      console.log('offeror is false, partnerUser', partnerUser)
        initializeSession(partnerUser.tokens.apiKey, partnerUser.tokens.sessionId, partnerUser.tokens.token);
        Socket.emit('acceptOffer', partnerUser);
    }

    function initializeSession(apiKey, sessionId, token) {
        session = OT.initSession(apiKey, sessionId);

        // Subscribe to a newly created stream
        session.on('streamCreated', function(event) {
            session.subscribe(event.stream, 'subscriber', {
                insertMode: 'append',
                width: '100%',
                height: '300px'
            });
        });

        session.on('sessionDisconnected', function(event) {
            session.off('streamCreated');
            console.log('You were disconnected from the session.', event.reason);
        });

        // Connect to the session
        session.connect(token, function(error) {
            // If the connection is successful, initialize a publisher and publish to the session
            if (!error) {
                let publisher = OT.initPublisher('publisher', {
                    insertMode: 'append',
                    width: '0%',
                    height: '0%'
                });

                session.publish(publisher);
            } else {
                console.log('There was an error connecting to the session: ', error.code, error.message);
            }
        });
    }

    Socket.on('offerAccepted', function(tokens) {
        initializeSession(tokens.apiKey, tokens.sessionId, sessionToken);
    });

    $scope.submit = () => {
        RunTests.submitCode({ code: $scope.theCode })
        .then((returnedValue) => console.log(returnedValue))
        .catch($log.error);
    };

    $scope.disconnect = function() {
        session.disconnect();
    };

    $scope.aceChanged = function(e) {
      console.log('aceChanged, currentUser', currentUser)
        Socket.emit('madeEdit', partnerUser, $scope.theCode);
    };

    Socket.on('receivedEdit', function(updatedCode) {
        $scope.theCode = updatedCode;
        $scope.$evalAsync();
    });

});
