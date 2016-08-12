// Angular module, defining routes for the app
/*
angular.module('polls', ['ngRoute','pollServices', "chart.js"]).
	config(['$routeProvider', function($routeProvider) {
       
		$routeProvider.
			when('/polls', { templateUrl: '/partials/list.ejs', controller: PollListCtrl }).
			when('/poll/:pollId', { templateUrl: '/partials/item.ejs', controller: PollItemCtrl }).
			when('/new', { templateUrl: '/partials/new.ejs', controller: PollNewCtrl }).
			// If invalid route, just redirect to the main list view
			otherwise({ redirectTo: '/polls' });
	}]).controller("PieCtrl", function ($scope) {
    console.log('in the controller for pie');
  $scope.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
  $scope.data = [300, 500, 100];
});
*/


var myModule = angular.module('polls', ['ngRoute','pollServices', 'chart.js']);

myModule.config(['$routeProvider', function($routeProvider) {
		$routeProvider.
			when('/polls', { templateUrl: '/partials/list.ejs', controller: PollListCtrl }).
			when('/poll/:pollId', { templateUrl: '/partials/item.ejs', controller: PollItemCtrl }).
			when('/new', { templateUrl: '/partials/new.ejs', controller: PollNewCtrl }).
			// If invalid route, just redirect to the main list view
			otherwise({ redirectTo: '/polls' });
	}]);

myModule.controller("PieCtrl", function ($scope) {
 
     console.log('in the controller for pie');
    
   var abc = $scope.poll;
   var length =0;
   var  choiceText =[];
   var choiceValue =[];
    abc.$promise.then(function(data){
        length = data.choices.length;
      
        for( var i=0;i<length;i++){
            choiceText[i] = data.choices[i].text;
            var a = data.choices[i].votes.length;
            
                choiceValue[i]=a;
            
            
            
        }
    });
    console.log(choiceValue);
  $scope.labels = choiceText;
  $scope.data = choiceValue;
});