// public/js/services/GeekService.js
angular.module('UberService', []).factory('Uber', ['$http', function($http){
	return {
		//call to get all ubers
		get: function(){
			return $http.get('/api/ubers');
		},

		//call to POST and creat a new uber
		create: function(uberData){
			return $http.post('/api/ubers', uberData);
		},

		//call to DELETE an uber
		delete: function(id){
			return $http.delete('/api/ubers/' + id);
		}
	};

}]);