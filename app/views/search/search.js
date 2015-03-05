'use strict';

var app = angular.module('auxApp.search', ['ngRoute']);

app.controller('SearchCtrl', ['$scope', 'searchService', 'artistReleasesService', 'releaseService', 'API_KEYS', function($scope, searchService, artistReleasesService, releaseService, API_KEYS) {
  $scope.pageClass = 'page-search';

  var search = function(name) {
    if (name) {
      searchService.getArtistNames(name, API_KEYS.CONSUMER_KEY, API_KEYS.CONSUMER_SECRET)
	      .then(function(data3) {
	        $scope.clicked = false;
          $scope.results = data3.results;
	      }, function(data3) {
	      	//TODO: handle connection error
	      	console.log(data3);
	      })
	  }
    $scope.reset = function () {
      $scope.name = undefined;
    };
  }

  $scope.$watch('name', search, true);

  $scope.getArtistReleases = function(id) {
    artistReleasesService.getArtistDetails(id, API_KEYS.CONSUMER_KEY, API_KEYS.CONSUMER_SECRET)
      .then(function(data) {
        $scope.artist = data; 
      }, function(data) {
      	//TODO:
        console.log(data);
      });

    artistReleasesService.getReleases(id, API_KEYS.CONSUMER_KEY, API_KEYS.CONSUMER_SECRET)
      .then(function(data2) {
        $scope.releases = data2.releases;
        console.log("getReleases:");
        console.log($scope.releases);    
      }, function(data2) {
      	console.log(data2);
      });

    $scope.clicked = true;
  }

}]);

app.controller('VersionsCtrl', ['$scope', '$filter', 'versionsService', 'releaseService', 'API_KEYS', function($scope, $filter, versionsService, releaseService, API_KEYS) { 
  var artist_name = $scope.artist.name;
  var release_title = $scope.release.title;  

  /* TODO: some returned versions are not always accurate. Look at Multicast releases for example */
  $scope.getReleaseVersions = function() {
    versionsService.getVersions($scope.release.id, API_KEYS.CONSUMER_KEY, API_KEYS.CONSUMER_SECRET)
      .then(function(data5) {
        $scope.versions = data5.versions;
        console.log(data5.versions);
				
				/* TODO: need to convert returned json object into array in order to 'orderBy' 
				   Started work below.
				var versionsArray = [];
				for(var i in data5.versions) {
				  versionsArray.push([i, data5.versions [i]]);
				}
				console.log(versionsArray);
				$scope.versions = versionsArray;
				*/
	 
      }, function(data5) {
      	//Most likely returned a Status 404 (data coming back undefined)
      	//Therefore only a single version of the release exists.
      	//Therefore map release data to versions data object as a single item
      	$scope.versions = [{'title': $scope.release.title, 'format': $scope.release.format, 'label': $scope.release.label, 'catno': $scope.release.catno, 'country': $scope.release.country, 'released': $scope.release.released}];
        //TODO: $scope.release.catno, $scope.release.country, $scope.release.released returning null
      });
  }
  
}]);
     
/* Search Service */
app.factory('searchService', ['$http', '$q', function($http, $q) {
	var service = {};
	var baseUrl = 'https://api.discogs.com/database/search?type=artist&q=';
	var finalUrl = '';
	
  var makeUrl = function(_artist_name, _key, _secret) {
    finalUrl = baseUrl +  _artist_name + '&page=1&per_page=10&key=' + _key + '&secret=' + _secret;
    return finalUrl;
  }

  service.getArtistNames = function(artist_name, key, secret) {
    finalUrl = makeUrl(artist_name, key, secret);

    var deferred = $q.defer();
    $http({
  	  method: 'GET',
  	  url: finalUrl
    }).success(function(data3) {
  	  deferred.resolve(data3);
    }).error(function(data3) {
  	  deferred.reject();
    })
    return deferred.promise;
  }
  
  return service;
}]);

/* Artist and Release Details Service */
app.factory('artistReleasesService', ['$http', '$q', function($http, $q) {
  var service = {};
	var baseUrl = 'https://api.discogs.com/artists/';
	var finalUrl = '';
	
  var makeUrl = function(_id, _key, _secret) {
    finalUrl = baseUrl + _id + '?key=' + _key + '&secret=' + _secret;
    return finalUrl;
  }

  service.getArtistDetails = function(id, key, secret) {
    finalUrl = makeUrl(id, key, secret);

    var deferred = $q.defer();
    $http({
  	  method: 'GET',
  	  url: finalUrl
    }).success(function(data3) {
  	  deferred.resolve(data3);
    }).error(function(data3) {
  	  deferred.reject();
    })
    return deferred.promise;
  }

  service.getReleases = function(id, key, secret) {
    finalUrl = makeUrl(id + '/releases', key, secret);

    var deferred = $q.defer();
    $http({
  	  method: 'GET',
  	  url: finalUrl
    }).success(function(data3) {
  	  deferred.resolve(data3);
    }).error(function(data3) {
  	  deferred.reject();
    })
    return deferred.promise;
  }

	return service;
}]);

/* Versions Service */
app.factory('versionsService', ['$http', '$q', function($http, $q) {
	var service = {};
	var baseUrl = 'https://api.discogs.com/masters/';
	var finalUrl = '';
	
  var makeUrl = function(_release_id, _key, _secret) {
    finalUrl = baseUrl +  _release_id + '/versions?key=' + _key + '&secret=' + _secret;
    return finalUrl;
  }

  //http://api.discogs.com/masters/' + $scope.release.id + '/versions?key=wZLyHCjoEPIBZKwTONBs&secret=qJxUjATXZjCDfeOZuZVPDkUOKgmbqTXY

  service.getVersions = function(release_id, key, secret) {
    finalUrl = makeUrl(release_id, key, secret);

    var deferred = $q.defer();
    $http({
  	  method: 'GET',
  	  url: finalUrl
    }).success(function(data3) {
  	  deferred.resolve(data3);
    }).error(function(data3) {
  	  deferred.reject();
    })
    return deferred.promise;
  }
  
  return service;
}]);

 