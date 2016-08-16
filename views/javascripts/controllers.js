// Controller for the poll list
function PollListCtrl($scope, Poll) {
    $scope.polls = Poll.query();
}

// Controller for an individual poll
function PollItemCtrl($scope, $routeParams, socket, Poll) {
    $scope.poll = Poll.get({
        pollId: $routeParams.pollId
    });


    var abc = $scope.poll;
    var length = 0;
    var choiceText = [];
    var choiceValue = [];
    abc.$promise.then(function (data) {
        length = data.choices.length;

        for (var i = 0; i < length; i++) {
            choiceText[i] = data.choices[i].text;
            var a = data.choices[i].votes.length;
            console.log(a);
            choiceValue[i] = a;
        }
        console.log(choiceValue);
        $scope.labels = choiceText;
        $scope.data = choiceValue;
    });

    socket.on('myvote', function (data) {
        console.dir(data);
        if (data._id === $routeParams.pollId) {
            $scope.poll = data;
            var choiceText = [];
            var choiceValue = [];
            var length = data.choices.length;

            for (var i = 0; i < length; i++) {
                choiceText[i] = data.choices[i].text;
                var a = data.choices[i].votes.length;

                choiceValue[i] = a;




            }
            $scope.labels = choiceText;
            $scope.data = choiceValue;
        }
    });

    socket.on('vote', function (data) {
        console.dir(data);
        if (data._id === $routeParams.pollId) {
            $scope.poll.choices = data.choices;
            $scope.poll.totalVotes = data.totalVotes;
        }
    });

    $scope.vote = function () {
        var pollId = $scope.poll._id,
            choiceId = $scope.poll.userVote;

        if (choiceId) {
            var voteObj = {
                poll_id: pollId,
                choice: choiceId
            };
            socket.emit('send:vote', voteObj);
        } else {
            alert('You must select an option to vote for');
        }
    };
}

// Controller for creating a new poll
function PollNewCtrl($scope, $location, Poll) {
    // Define an empty poll model object
    $scope.poll = {
        question: '',
        choices: [{
            text: ''
        }, {
            text: ''
        }, {
            text: ''
        }]
    };

    // Method to add an additional choice option
    $scope.addChoice = function () {
        $scope.poll.choices.push({
            text: ''
        });
    };

    // Validate and save the new poll to the database
    $scope.createPoll = function () {
        var poll = $scope.poll;

        // Check that a question was provided
        if (poll.question.length > 0) {
            var choiceCount = 0;

            // Loop through the choices, make sure at least two provided
            for (var i = 0, ln = poll.choices.length; i < ln; i++) {
                var choice = poll.choices[i];

                if (choice.text.length > 0) {
                    choiceCount++
                }
            }

            if (choiceCount > 1) {
                // Create a new poll from the model
                var newPoll = new Poll(poll);

                // Call API to save poll to the database
                newPoll.$save(function (p, resp) {
                    if (!p.error) {
                        // If there is no error, redirect to the main view
                        $location.path('polls');
                    } else {
                        alert('Could not create poll');
                    }
                });
            } else {
                alert('You must enter at least two choices');
            }
        } else {
            alert('You must enter a question');
        }
    };
}