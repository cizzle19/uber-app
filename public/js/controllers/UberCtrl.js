// public/js/controllers/UberCtrl.js
angular.module('UberCtrl', []).controller('UberController', function($scope, $http, $timeout, $window, Uber){

	$scope.listUbers = "";
	$scope.name = "";
	$scope.latitude = "";
	$scope.longitude = "";
	$scope.position = "";
	$scope.currentLat = "";
	$scope.currentLng = "";
	$scope.uberTime = "";

	//get current location now
	 $window.navigator.geolocation.getCurrentPosition(function(position) {
    	$scope.position = position;
    	$scope.currentLat = $scope.position.coords.latitude.toFixed(6);
    	$scope.currentLng = $scope.position.coords.longitude.toFixed(6);
    });

	//load current position and refresh list
	setTimeout( function(){
		getUberTime($scope.currentLat, $scope.currentLng);
		//use google api to do reverse api call to find rough address
		var geocoder = new google.maps.Geocoder();
		var initialLocation = new google.maps.LatLng($scope.currentLat,$scope.currentLng);
		geocoder.geocode({'location': initialLocation}, function(results, status){
			if(status == google.maps.GeocoderStatus.OK){
				//console.log(results[0].formatted_address);
				$scope.estimatedAddress = results[0].formatted_address;
			}
			else{
				alert("could not do reverse lookup");
			}

		});

		},1000);
	//load all ubers on landing
	getUbers();

	//load maps
	loadMaps();

	//call to get list of ubers
	function getUbers(){
		Uber.get()
		.success(function(ubers){
			$scope.listUbers = ubers;
		})
		.error(function(error){
			console.log(error.message);
		});

	}

	//add new uber location
	$scope.addUber = function(){
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode({ 'address' : $scope.address}, function(results, status){
			if(status == google.maps.GeocoderStatus.OK){
				$scope.latitude = results[0].geometry.location.lat().toFixed(6);
				$scope.longitude = results[0].geometry.location.lng().toFixed(6);
				getUberPrice($scope.currentLat, $scope.currentLng, $scope.latitude, $scope.longitude);

				setTimeout(function(){
					var uber = {
						name: $scope.name,
						address: $scope.address,
						latitude: $scope.latitude,
						longitude: $scope.longitude
					}
					Uber.create(uber)
						.success(function(){
							getUbers();
							loadMaps();
							$scope.name = "";
							$scope.address = "";
							$scope.latitude = "";
							$scope.longitude = "";
						})
						.error(function(error){
							console(error.message);
						});
				}, 500);
			}
			else{
				alert("could not find address");
			}
		});
	};

	//delete uber location
	$scope.deleteUber = function(id){
		Uber.delete(id)
			.success(function(){
				getUbers();
				loadMaps();
			})
			.error(function(error){
				console.log(error);
			});

	};

	//use uber api to see what types of uber are available based on location
	function getUber(latitude, longitude){
		var uber = { 'server_token'	: 'API-KEY', 'latitude' : latitude, 'longitude' : longitude};

		$http({
			url: 'https://api.uber.com/v1/products',
			method: "GET",
			params: uber
		})
		.success(function(data){
			//$scope.uberData = data;
			console.log(data);
		});
	}

	//use uber api to see price of trip
	function getUberPrice(start_lat, start_lng, end_lat, end_lng){
		var uber = {
			'server_token': 'API-KEY', 
			'start_latitude': start_lat, 
			'start_longitude': start_lng, 
			'end_latitude': end_lat,
			'end_longitude': end_lng
		};

		$http({
			url: 'https://api.uber.com/v1/estimates/price',
			method: "GET",
			params: uber
		})
		.success(function(data){
			$scope.uberPrice = data;
			$scope.name = $scope.uberPrice.prices[0].estimate;
		});
	}

	//use uber api to see how long until next available driver will be
	function getUberTime(start_lat, start_lng){
		var uber = {
			'server_token': 'API-KEY', 
			'start_latitude': start_lat, 
			'start_longitude': start_lng 
		};
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
	}

	//load map
	function loadMaps(){
		setTimeout( function(){
			var bounds = new google.maps.LatLngBounds();
			var mapOptions = {
		        zoom: 4,
		        center: new google.maps.LatLng(40.0000, -98.0000)
		    }

		    $scope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

		    for (var x = 0; x < $scope.listUbers.length; x++) {
		        var lat = $scope.listUbers[x].latitude;
		        var lng = $scope.listUbers[x].longitude;
		        var latlng = new google.maps.LatLng(lat, lng);
		        marker = new google.maps.Marker({
		            position: latlng,
		            map: $scope.map
		        });
		        bounds.extend(marker.position);
		    }
		    $scope.map.fitBounds(bounds);

		},500);
	}

});
