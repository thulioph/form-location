'use strict';

/**
 * @ngdoc function
 * @name formLocationApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the formLocationApp
 */
angular.module('formLocationApp')
  .controller('MainCtrl', ['$scope', function ($scope) {

    // searching user location
    $scope.getUserLocation = function() {
      var geocoder, latlng, mapOptions, map, infowindow, marker, location_info;

      location_info = {};

      function getLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(success, error);
        } else {
          console.warn('Geolocation is not supported.')
        }
      };

      function success(position) {
        geocoder = new google.maps.Geocoder();

        latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        mapOptions = {
        zoom: 10,
        center: latlng,
        mapTypeId: 'roadmap'
        }

        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

        infowindow = new google.maps.InfoWindow;

        geocoder.geocode({'latLng': latlng}, function(results, status) {
          // console.warn(results);

          if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {
              map.setZoom(11);

              marker = new google.maps.Marker({
                position: latlng,
                map: map
              });

              location_info.full_address = results[0].formatted_address;
              location_info.address = results[0].address_components[0].long_name;
              location_info.neighborhood = results[0].address_components[1].long_name;
              location_info.city = results[0].address_components[2].long_name;
              location_info.state = results[0].address_components[4].long_name;
              location_info.country = results[0].address_components[5].long_name;

              $scope.location_info = location_info;

              $scope.user_data = {
                address: $scope.location_info.address,
                neighborhood: $scope.location_info.neighborhood,
                city: $scope.location_info.city,
                state: $scope.location_info.state,
                country: $scope.location_info.country
              };

              infowindow.setContent(location_info.full_address);
              infowindow.open(map, marker);

              $scope.$apply();
            } else {
              alert('Without results..');
            }
          } else {
            alert('Geocoder error: ' + status);
          }
        });

        google.maps.event.addDomListener(window, 'load', success);
      };

      function error(error) {
        console.warn(error);
      };

      getLocation();
    };
    // ====

    // send data
    $scope.user_data = {};

    $scope.hungry = function() {
      $scope.msg = $scope.user_data;

      // console.warn($scope.msg);
    };
    // ====

  }]);
