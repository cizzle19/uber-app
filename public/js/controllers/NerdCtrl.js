angular.module('NerdCtrl', [])
.filter('minute', function(){
	return function(item){
		return Math.round(item/60);
	};
})
.controller('NerdController', function($scope, $http, $timeout, $window, Nerd){

	$scope.listNerds = "";

	$scope.uberData = "";
	$scope.uberPrice = "";
	$scope.uberTime = "";
	$scope.position = "";

	//get current location now
	 $window.navigator.geolocation.getCurrentPosition(function(position) {
    	$scope.position = position;
    	$scope.start_longitude = $scope.position.coords.longitude.toFixed(6);
    	$scope.start_latitude = $scope.position.coords.latitude.toFixed(6);
    });

	getNerds();

	function getNerds(){
		Nerd.get()
			.success(function(nerds){
				$scope.listNerds = nerds;
			})
			.error(function(error){
				console.log(error.message);
			});
	}

	$scope.addNerd = function(){
		var nerd = {
			name: $scope.newName
		};

		Nerd.create(nerd)
			.success(function(){
				getNerds();
				$scope.newName = "";
			})
			.error(function(error){
				console(error.message);
			});
	};

	$scope.deleteNerd = function(id){
		Nerd.delete(id)
			.success(function(){
				getNerds();
			})
			.error(function(error){
				console.log(error);
			});
	};

	$scope.getUber = function(){
		var uber = { 'server_token'	: 'MenhQioKFctRajzpYWXb-6o3ZKqW2ivvIm-8SdO0', 'latitude' : 41.8169925, 'longitude' : -71.4211681};

		$http({
			url: 'https://api.uber.com/v1/products',
			method: "GET",
			params: uber
		})
		.success(function(data){
			$scope.uberData = data;
		});
	};

	$scope.getUberPrice = function(){
		var uber = {
			'server_token'		: 'MenhQioKFctRajzpYWXb-6o3ZKqW2ivvIm-8SdO0', 'start_latitude' 	: 41.8169925, 'start_longitude' 	: -71.4211681, 'end_latitude'		: 41.768543,
			'end_longitude'		: -71.4701277
		};

		$http({
			url: 'https://api.uber.com/v1/estimates/price',
			method: "GET",
			params: uber
		})
		.success(function(data){
			$scope.uberPrice = data;
		});
	};

	//timeout function in seconds changing btween refreshing every 30-60 seconds
	$scope.getUberTime = function(){

		
		var uber = {'server_token': 'MenhQioKFctRajzpYWXb-6o3ZKqW2ivvIm-8SdO0', 'start_latitude' 	: $scope.start_latitude, 'start_longitude' 	: $scope.start_longitude };

		var timer = $timeout(function refresh(){
			$http({
				url: 'https://api.uber.com/v1/estimates/time',
				method: "GET",
				params: uber
			})
			.success(function(data){
				$scope.uberTime = data;
			});
			timer = $timeout(refresh, 30000);
		}, 100);
	};
});