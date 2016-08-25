// Controller for the poll list
function PollListCtrl($scope, Poll) {
    $scope.polls = Poll.query();
    // console.log( $scope.poll.userVoted);
    
    $('#pie').hide(); 
    
   
    
     
      console.log( );
}

// Controller for the sports poll
function PollSportsCtrl($scope, Poll) {
console.log('in sports controller');
var allpolls = Poll.query();
var sportsPolls = [];
var count =0;
allpolls.$promise.then(function (data){
    console.log(data);
   var length = data.length;
    for(var i=0; i<length; i++){
        if(data[i].category == "Sports"){
            sportsPolls[count] = data[i];
            count++;
        }
    }
    console.log(sportsPolls);
    $scope.polls = sportsPolls;
    $scope.categoryHeading = "Sports Polls";
});
}


//Controller for entertainments poll
function PollEntertainmentCtrl($scope, Poll) {
console.log('in entertainment controller');
var allpolls = Poll.query();
var entertainmentPolls = [];
var count =0;
allpolls.$promise.then(function (data){
    console.log(data);
   var length = data.length;
    for(var i=0; i<length; i++){
        if(data[i].category == "Entertainment"){
            entertainmentPolls[count] = data[i];
            count++;
        }
    }
    console.log(entertainmentPolls);
    $scope.polls = entertainmentPolls;
    $scope.categoryHeading = "Entertainment Polls";
});
}

//Controller for politics poll
function PollPoliticsCtrl($scope, Poll) {
console.log('in politics controller');
var allpolls = Poll.query();
var politicsPolls = [];
var count =0;
allpolls.$promise.then(function (data){
    console.log(data);
   var length = data.length;
    for(var i=0; i<length; i++){
        if(data[i].category == "politics"){
            politicsPolls[count] = data[i];
            count++;
        }
    }
    console.log(politicsPolls);
    $scope.polls = politicsPolls;
    $scope.categoryHeading = "Politics Polls";
});
}

//Controller for general poll
function PollGeneralCtrl($scope, Poll) {
console.log('in general controller');
var allpolls = Poll.query();
var generalPolls = [];
var count =0;
allpolls.$promise.then(function (data){
    console.log(data);
   var length = data.length;
    for(var i=0; i<length; i++){
        if(data[i].category == "General"){
           generalPolls[count] = data[i];
            count++;
        }
    }
    console.log(generalPolls);
    $scope.polls = generalPolls;
    $scope.categoryHeading = "General Polls";
});
}

//Controller for other poll
function PollOtherCtrl($scope, Poll) {
console.log('in other controller');
var allpolls = Poll.query();
var otherPolls = [];
var count =0;
allpolls.$promise.then(function (data){
    console.log(data);
   var length = data.length;
    for(var i=0; i<length; i++){
        if(data[i].category == "other"){
           otherPolls[count] = data[i];
            count++;
        }
    }
    console.log(otherPolls);
    $scope.polls = otherPolls;
    $scope.categoryHeading = "Other Polls";
});
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
    
    
  
    $('#doughnut').hide(); 
    $('#polar-area').hide(); 
    
    $scope.chartChange=function()
     {  
    $('#pie').hide(); 
    $('#doughnut').hide(); 
    $('#polar-area').hide();
    var id= $('#chart').val();
    if(id=='pie')
        $('#pie').show(); 
    if(id=='doughnut')
        $('#doughnut').show();
    if(id=='polar')
        $('#polar-area').show();
      
     }
    
    
    
}

// Controller for creating a new poll
function PollNewCtrl($scope, $location, Poll) {
    // Define an empty poll model object
    $scope.poll = {
        question: '',
        category: '',
        choices: [{
            text: ''
        }, {
            text: ''
        }, {
            text: ''
        }]
    };
    
    //Method to clear answer    	
	$scope.ClearAnswer = function(choice) {
		delete choice.text;
	};
    
     //Method to remove answer 
    $scope.RemoveAnswer = function(key){
        console.log(key);
        if ($scope.poll.choices.length > 2) {
            $scope.poll.choices.splice(key,1);
        } else {
            alert('At least 2 answers are needed for a poll.');
        }
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
