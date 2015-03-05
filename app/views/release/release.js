'use strict';

var app = angular.module('auxApp');

app.controller('ReleaseCtrl', ['$scope', '$location', '$routeParams', '$sce', '$filter', 'releaseService', 'addReleaseService', 'API_KEYS', function($scope, $location, $routeParams, $sce, $filter, releaseService, addReleaseService, API_KEYS) {
  $scope.pageClass = 'page-release';
  $scope.showTable = false;
  $scope.showReleaseDetails = true;
  $scope.showErrorMsg = false;

  //Hide or show buttons depending on path/location
  var path = $location.path();

  $scope.showAddBtn = false;
  $scope.showDeleteBtn = false;
  $scope.backLink = '';

  if (path.indexOf("search") === 1) {
    $scope.showAddBtn = true;
    $scope.backLink = '#/search';
  } else if (path.indexOf("wantlist") === 1) {
    $scope.showDeleteBtn = true;
    $scope.backLink = '#/wantlist';
  }

  //obtain the discogs releaseid via the uri
  var releaseId = $routeParams.releaseId;
  
  var getReleaseDetails = function(release_id, key, secret) {
    releaseService.getReleaseDetails(release_id, key, secret)
      .then(function(data6) {
        $scope.releaseDetails = data6;

        if($scope.releaseDetails.notes != undefined) {
          //filter notes to html and sanitize
          var notes = $filter('cleanText')($scope.releaseDetails.notes);
          $scope.notes = $sce.trustAsHtml(notes);
        }
      }, function(data6) {
        if (data6 === undefined) {
          //handle connection error
          console.log("CONNECTION ERROR!!!");
          $scope.showReleaseDetails = false;
          $scope.showErrorMsg = true;
        }

        //TODO: Another option is to see about autmatically trying the 
        //connection again, maybe up to 3 times?
      });

    releaseService.getMarketDetails(release_id)
      .then(function(rawMarketData) {
        if (rawMarketData.length > 0) {
          $scope.marketData = processMarketData(rawMarketData);
          $scope.marketDataMsg = "Current Discogs Marketplace Data:"
          $scope.showTable = true;
        } else {
          $scope.marketDataMsg = "No market data currently available for this release."
          $scope.showTable = false;
        }
      }, function(rawMarketData) {
        console.log(rawMarketData);
        if (rawMarketData === undefined) {
          //connection error
          console.log("CONNECTION ERROR!!!");
          $scope.marketDataMsg = "No market data currently available for this release."
          $scope.showTable = false;
        }
      });
  }
  
  getReleaseDetails(releaseId, API_KEYS.CONSUMER_KEY, API_KEYS.CONSUMER_SECRET);

  $scope.addReleaseToWantlist = function(release_id) {
    addReleaseService.addToWantlist(release_id, 'crixmadine71')
      .then(function(data) {
        //TODO:
        console.log(data);   
      }, function(data) {
        //TDOD:
        console.log(data);
      })
  }

  $scope.deleteReleaseFromWantlist = function(release_id) {
    //TODO: 
    console.log("Deleting release");
  }
}]);

/* Serivce to Add a release to Wantlist */
app.factory('addReleaseService', ['$http', '$q', function($http, $q) {
  var service = {};
  var baseUrl = 'https://api.discogs.com/users/';

  var finalUrl = '';
  
  var makeUrl = function(_release_id, _discogs_user) {
    finalUrl = baseUrl + _discogs_user + '/wants/' + _release_id + '?key=wZLyHCjoEPIBZKwTONBs&secret=qJxUjATXZjCDfeOZuZVPDkUOKgmbqTXY';
    return finalUrl;
  }

  service.addToWantlist = function(release_id, discogs_user) {
    finalUrl = makeUrl(release_id, discogs_user);
    console.log("Final URL: " + finalUrl);

    var deferred = $q.defer();
    $http({
      method: 'POST',
      url: finalUrl
    }).success(function(data) {
      deferred.resolve(data);
    }).error(function(data) {
      deferred.reject();
    })
    return deferred.promise;
  }

  return service;
}]);

/* Helper Functions */
/* 
Process the current discogs market data for a given release returning 
average, lowest and highest prices for a given region/currency.
*/
var processMarketData = function(marketData) {
  var processedMarketData = [];
  var usData = [];
  var euroData = [];
  var ukData =[];
  var cadData = [];
  var audData = [];
  var price = null;

  var currency = "";
  for (var i = 0; i < marketData.length; i++) {
    if (marketData[i].currency === "USD") {
      price = sanitizePrice(marketData[i].price);
      usData.push(price);
    } else if (marketData[i].currency === "EUR") {
      price = sanitizePrice(marketData[i].price);
      euroData.push(price);
    } else if (marketData[i].currency === "GBP") {
      price = sanitizePrice(marketData[i].price);
      ukData.push(price);
    } else if (marketData[i].currency === "CAD") {
      price = sanitizePrice(marketData[i].price);
      cadData.push(price);
    } else if (marketData[i].currency === "AUD") {
      price = sanitizePrice(marketData[i].price);
      audData.push(price);
    }
  }

  if (usData.length > 0) {
    var usPriceData = getPriceData(usData, "USD");
    processedMarketData.push(usPriceData);
  }

  if (euroData.length > 0) {
    var euroPriceData = getPriceData(euroData, "EUR");
    processedMarketData.push(euroPriceData);
  }

  if (ukData.length > 0) {
    var ukPriceData = getPriceData(ukData, "GBP");
    processedMarketData.push(ukPriceData);
  }
  
  if (cadData.length > 0) {
    var cadPriceData = getPriceData(cadData, "CAD");
    processedMarketData.push(cadPriceData);
  }

  if (audData.length > 0) {
    var audPriceData = getPriceData(audData, "AUD");
    processedMarketData.push(audPriceData);
  }

  return processedMarketData;
}

/* Remove all non / dot digits from currency string */
var sanitizePrice = function(priceString) {
  var priceNumber = Number(priceString.replace(/[^0-9\.]+/g,""));
  return priceNumber;
}

/* 
Given price data and currency for a given region,
calculate and return the newly formatted data.
*/ 
var getPriceData = function(priceDataArray, currency) {
  var priceData = {};

  if (priceDataArray.length > 0) {
    var priceData = {};
    var lowestPrice = Array.min(priceDataArray);
    var highestPrice = Array.max(priceDataArray);
    var sum = 0;
    for (var i = 0; i < priceDataArray.length; i++) {
      sum += parseFloat(priceDataArray[i], 10);
    }
    var avgPrice = sum/priceDataArray.length;

    priceData = {
      currency : currency, 
      avgPrice : avgPrice.toFixed(2), 
      lowestPrice : lowestPrice.toFixed(2), 
      highestPrice : highestPrice.toFixed(2)
    };
  }

  return priceData;
}

/* Return the lowest value of the array */
Array.min = function(array){
  return Math.min.apply(Math, array);
}

/* Return the highest value of the array */
Array.max = function(array){
  return Math.max.apply(Math, array);
}





