(function () {
    'use strict';

    // this will be populated when the auth token is fetched
    // it is later needed to sign into Skype for Business
    var authDetails = {};

    // A reference to the Skype SDK application object
    // set during initialization
    var app;

    displayStep(0);
    registerUIListeners();

    // Initializing the Skype application
    Skype.initialize({
        apiKey: '9c967f6b-a846-4df2-b43d-5167e47d81e1'
    }, function (api) {
        console.log('Skype SDK initialization successful');

        app = api.UIApplicationInstance;

        // Once it is initialized, display a UI prompt for a meeting URL
        displayStep(1);
    }, function (err) {
        console.error('Skype SDK initialization error:', err);
    });

    // After the user submits the meeting URL the next step is to 
    // fetch an auth token
    function getToken(evt) {
        var input = evt.target.querySelector('input'),
            meetingUrl = input.value,
            request = new XMLHttpRequest(),
            data;

        evt.preventDefault();
        console.log('Fetching auth token from meeting url:', meetingUrl);

        function guid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        }

        var sessionId = guid();
        data = 'ApplicationSessionId=' + sessionId +
            '&AllowedOrigins=' + encodeURIComponent(window.location.href) +
            '&MeetingUrl=' + encodeURIComponent(meetingUrl);

        request.onreadystatechange = function () {
            if (request.readyState === XMLHttpRequest.DONE) {
                if (request.status === 200) {
                    var response = JSON.parse(request.response);

                    authDetails.discoverUrl = response.DiscoverUri;
                    authDetails.authToken = "Bearer " + response.Token;

                    console.log('Successfully fetched the anonymous auth token and discoverUrl', authDetails);
                    displayStep(2);
                }
                else {
                    console.error('An error occured, fetching the anonymous auth token', request.responseText);
                }
            }
        };

        request.open('post', 'http://webrtctest.cloudapp.net/getAnonTokenJob');
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send(data);
    }

    // This uses the auth token and discovery URL to sign into Skype
    // and join the meeting
    function joinAVMeeting(evt) {
        var input = evt.target.querySelector('input'),
            name = input.value;

        evt.preventDefault();
        console.log('Joinig meeting as:', name);

        app.signInManager.signIn({
            name: name,
            cors: true,
            root: { user: authDetails.discoverUrl },
            auth: function (req, send) {
                // Send token with all requests except for the GET /discover
                if (req.url != authDetails.discoverUrl)
                    req.headers['Authorization'] = authDetails.authToken;
                return send(req);
            }
        }).then(function () {
            // When joining a conference anonymously, the SDK automatically creates
            // a conversation object to represent the conference being joined
            var conversation = app.conversationsManager.conversations(0);

            console.log('Successfully signed in with anonymous online meeting token');

            registerAppListeners(conversation);

            // This turns on local video and joins the meeting
            startVideoService(conversation);

        }).catch(function (error) {
            console.error('Unable to join conference anonymously:', error);
        });


        function registerAppListeners(conversation) {
            conversation.selfParticipant.video.state.when('Connected', function () {

                console.log('Showing self video');

                document.querySelector('.self').style.display = 'inline-block';
                setupContainer(conversation.selfParticipant.video.channels(0), document.querySelector('.self .video'));
                displayName(document.querySelector('.self'), conversation.selfParticipant);

                console.log('The video mode of the application is:', conversation.videoService.videoMode());

                if (conversation.videoService.videoMode() === 'MultiView') {
                    // Loading the sample in any other browser than Google Chrome means that 
                    // the videoMode is set to 'MultiView'
                    // Please refer to https://msdn.microsoft.com/en-us/skype/websdk/docs/ptvideogroup
                    // on an example on how to implement group video.
                }

                // When in active speaker mode only one remote channel is available.
                // To display videos of multiple remote parties the video in this one channel
                // is switched out automatically, depending on who is currently speaking
                if (conversation.videoService.videoMode() === 'ActiveSpeaker') {
                    var activeSpeaker = conversation.videoService.activeSpeaker;

                    setupContainer(activeSpeaker.channel, document.querySelector('.remote .video'));

                    activeSpeaker.channel.isVideoOn.when(true, function () {
                        document.querySelector('.remote').style.display = 'inline-block';
                        activeSpeaker.channel.isStarted(true);

                        console.log('ActiveSpeaker video is available and has been turned on.');
                    });

                    activeSpeaker.channel.isVideoOn.when(false, function () {
                        document.querySelector('.remote').style.display = 'none';
                        activeSpeaker.channel.isStarted(false);

                        console.log('ActiveSpeaker video is not available anymore and has been turned off.');
                    });

                    // the .participant object changes when the active speaker changes
                    activeSpeaker.participant.changed(function (newValue, reason, oldValue) {
                        console.log('The ActiveSpeaker has changed. Old ActiveSpeaker:', oldValue && oldValue.displayName(), 'New ActiveSpeaker:', newValue && newValue.displayName());

                        if (newValue) {
                            displayName(document.querySelector('.remote'), newValue);
                        }
                    });
                }
            });

            conversation.state.changed(function (newValue, reason, oldValue) {
                if (newValue === 'Disconnected' && (oldValue === 'Connected' || oldValue === 'Connecting')) {
                    console.log('The conversation has ended.');
                    reset();
                }
            });
        }

        function setupContainer(videoChannel, videoDiv) {
            videoChannel.stream.source.sink.format('Stretch');
            videoChannel.stream.source.sink.container(videoDiv);
        }

        function displayName(container, person) {
            container.querySelector('.displayName .detail').innerHTML = person.displayName();
        }

        function startVideoService(conversation) {
            conversation.videoService.start().then(null, function (error) {
                console.error('An error occured joining the conversation:', error);
            });
            displayStep(3);
        }
    }

    function endConversation(evt) {
        var conversation = app.conversationsManager.conversations(0);

        evt.preventDefault();

        conversation.leave().then(function () {
            console.log('The conversation has ended.');
            reset();
        }, function (error) {
            console.error('An error occured ending the conversation:', error);
        }).then(function () {
            reset();
        });
    }


    //-----------------------------------------------------------------------
    //UI helper functions
    function displayStep(step) {
        var nodes = document.querySelectorAll('.step');

        for (var i = 0; i < nodes.length; ++i) {
            var node = nodes[i];
            
            node.style.display = 'none';

            if (i === step) {
                node.style.display = 'block';
            }
        }
    }

    function registerUIListeners() {
        document.querySelector('.step1').onsubmit = getToken;
        document.querySelector('.step2').onsubmit = joinAVMeeting;
        document.querySelector('.step3').onsubmit = endConversation;
    }

    function reset() {
        window.location = window.location.href;
    }

})();