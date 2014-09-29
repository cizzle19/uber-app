angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){

	$routeProvider

	// home page
	.when('/', {
		templateUrl: 'views/home.html',
		controller: 'MainController'
	})

	// nerds paage that will use the NerdController

	.when('/nerds', {
		templateUrl: 'views/uber.html',
		controller: 'NerdController'
	})

	// geeks page that will use the GeekController

	.when('/ubers', {
		templateUrl: 'views/ubers.html',
		controller: 'UberController'
	});

	$locationProvider.html5Mode(true);

}]);