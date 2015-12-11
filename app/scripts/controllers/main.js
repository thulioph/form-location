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

    // localizando o usuário
    $scope.getUserLocation = function() {
      var geocoder, latlng, mapOptions, map, infowindow, marker, location_info;

      location_info = {};

      function getLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(success, error);
        } else {
          console.warn('Geolocation não é suportado pelo seu navegador.')
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
          console.warn(results);

          if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {
              map.setZoom(11);

              marker = new google.maps.Marker({
                position: latlng,
                map: map
              });

              location_info.full_address = results[0].formatted_address;
              // location_info.zip = results[3].address_components[0].long_name;

              location_info.address = results[0].address_components[0].long_name;
              location_info.neighborhood = results[0].address_components[1].long_name;
              location_info.city = results[0].address_components[2].long_name;
              location_info.state = results[0].address_components[4].long_name;
              location_info.country = results[0].address_components[5].long_name;

              $scope.user_data = location_info;

              infowindow.setContent(location_info.full_address);
              infowindow.open(map, marker);

              console.log('$scope.user_data -> ', $scope.user_data);
            } else {
              alert('Sem resultados..');
            }
          } else {
            alert('Geocoder falhou por conta de: ' + status);
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

    // enviar pedido
    $scope.user_data = {};

    $scope.hungry = function() {
      console.log($scope.user_data);
    };
    // ====

  }]);
