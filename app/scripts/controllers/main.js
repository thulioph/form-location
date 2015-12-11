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

    var geocoder, latlng, mapOptions, map, infowindow, marker, cep, logradouro, location_info;

    location_info = [];

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

      // efetuando o geocode a partir da localização do usuário
      geocoder.geocode({'latLng': latlng}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (results[0]) {
              map.setZoom(11);

              marker = new google.maps.Marker({
                position: latlng,
                map: map
              });

            cep = results[3].address_components[0].long_name;
            logradouro = results[0].formatted_address;

            infowindow.setContent(logradouro + cep);
            infowindow.open(map, marker);

            // $scope.location_info.data = logradouro + ', ' + cep;
            location_info.data = logradouro + ', ' + cep;

            $scope.location_info = location_info;

            console.log('$scope.location_info -> ', $scope.location_info);
          } else {
            alert('Sem resultados..');
          }
        } else {
          alert('Geocoder falhou por conta de: ' + status);
        }
      });

      // executa o mapa passando a função success quando o dom fizer o load
      google.maps.event.addDomListener(window, 'load', success);
    };

    function error(error) {
      console.warn(error);
    };

    $scope.getUserLocation = function() {
      getLocation();
    };

  }]);
