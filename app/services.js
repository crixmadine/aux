
'use strict';

var app = angular.module('auxApp');

/* Release Details Service */
app.factory('releaseService', ['$http', '$q', function($http, $q) {
  var service = {};
  var baseUrl = 'https://api.discogs.com/releases/';
  var marketPlaceBaseUrl = 'https://api.discogs.com/marketplace/search?release_id=';
  var finalUrl = '';
  
  var makeUrl = function(_release_id, _key, _secret) {
    finalUrl = baseUrl +  _release_id + '?key=' + _key + '&secret=' + _secret;
    return finalUrl;
  }
  
  service.getReleaseDetails = function(release_id, key, secret) {
    finalUrl = makeUrl(release_id, key, secret);
    var deferred = $q.defer();
    $http({
      method: 'GET',
      url: finalUrl
    }).success(function(data4) {
      deferred.resolve(data4);
    }).error(function(data4) {
      deferred.reject();
    })
    return deferred.promise;
  }

  service.getMarketDetails = function(release_id) {
    var deferred = $q.defer();
    $http({
      method: 'GET',
      url: marketPlaceBaseUrl + release_id
    }).success(function(data5) {
      deferred.resolve(data5);
    }).error(function(error) {
      console.log(error);
      deferred.reject();
    })
    return deferred.promise;
  }
  
  return service;
}]);

/* This Service gets a release cover image based on artist and release. 
   It requires an api key obtained from LastFM.
*/
/*
app.factory('lastFmImageService', ['$http', '$q', function($http, $q) {
  var service = {};
  var baseUrl = 'http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=';
  var finalUrl = '';

  var makeUrl = function(_api_key, _artist_name, _release_title) {
    finalUrl = baseUrl +  _api_key + '&artist=' + escape(_artist_name) + '&album=' + escape(_release_title) + '&format=json';
    return finalUrl;
  }
  
  service.getReleaseImage = function(api_key, artist_name, release_title) {
    finalUrl = makeUrl(api_key, artist_name, release_title); 
 
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
*/


