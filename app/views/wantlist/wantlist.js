'use strict';

var app = angular.module('auxApp.wantlist', ['ngRoute']);

app.controller('WantlistCtrl', ['$scope', 'wantlistService', 'API_KEYS', function($scope, wantlistService, API_KEYS) {
  $scope.pageClass = 'page-wantlist';

  var discogs_user = 'crixmadine71';
  $scope.wants = {};
  $scope.releaseDetails = {};

  var wantlist = function(discogsuser, consumerkey, consumersecret) {
    wantlistService.getWantlist(discogsuser, consumerkey, consumersecret)
      .then(function(data) {
        $scope.wants = data.wants;   
      }, function(data) {
      	//TODO:
        console.log(data);
      })
  }

  wantlist(discogs_user, API_KEYS.CONSUMER_KEY, API_KEYS.CONSUMER_SECRET);
  
}]);

/* This service returns a Discogs wantlist based on discogs user. */
app.factory('wantlistService', ['$http', '$q', function($http, $q) {
	var service = {};
	var baseUrl = 'https://api.discogs.com/users/';
	var finalUrl = '';

	//final url:
	//https://api.discogs.com/users/crixmadine71/wants?key=wZLyHCjoEPIBZKwTONBs&secret=qJxUjATXZjCDfeOZuZVPDkUOKgmbqTXY
  
  var makeUrl = function(_discogsuser, _key, _secret) {
    finalUrl = baseUrl +  _discogsuser + '/wants?key=' + _key + '&secret=' + _secret;
    return finalUrl;
  }
  
  service.getWantlist = function(discogsuser, key, secret) {
    finalUrl = makeUrl(discogsuser, key, secret);
 
    var deferred = $q.defer();
    $http({
    	method: 'GET',
    	url: finalUrl,
      cache: true
    }).success(function(data) {
    	deferred.resolve(data);
    }).error(function(data) {
    	deferred.reject();
    })
    return deferred.promise;
  }
  
  return service;
}]);
