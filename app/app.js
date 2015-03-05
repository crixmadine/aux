'use strict';

angular.module('auxApp', [
  'ngRoute',
  'ngAnimate',
  'auxApp.wantlist',
  'auxApp.search',
  'mobile-angular-ui'
]).

constant('API_KEYS', {
  'CONSUMER_KEY': 'wZLyHCjoEPIBZKwTONBs',
  'CONSUMER_SECRET': 'qJxUjATXZjCDfeOZuZVPDkUOKgmbqTXY'
  /*('LAST_FM_API_KEY': 'e8aefa857fc74255570c1ee62b01cdba'*/
}).

config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: '/wantlist',
    controller: 'WantlistCtrl'
  })
  .when('/wantlist', {
    templateUrl: 'views/wantlist/wantlist.html',
    controller: 'WantlistCtrl'
  })
  .when('/search', {
    templateUrl: 'views/search/search.html',
    controller: 'SearchCtrl'
  })
  .when('/wantlist/release/:releaseId', {
    templateUrl: 'views/release/release.html',
    controller: 'ReleaseCtrl'
  })
  .when('/search/release/:releaseId', {
    templateUrl: 'views/release/release.html',
    controller: 'ReleaseCtrl'
  })
  .otherwise({
    redirectTo: '/wantlist',
    controller: 'ReleaseCtrl'
  });
}]).

/* Shared Controllers */

controller('NavBarCtrl', ['$scope', '$location', function($scope, $location) {
  $scope.isCollapsed = true;

  $scope.isActive = function (viewLocation) { 
    return viewLocation === $location.path();
  };
}]).

/* Custom filters */

filter('cleanText', function () {
  return function (str) {
    var str = str.split('[url=').join('<a href="');
    str = str.split('[/url]').join('</a>');
    str = str.split(']').join('">');

    return str;
  };
}).

filter('localizePrice', function($filter) {
  return function(amount, currency) {
    var localizedPrice = amount;

    if (currency === 'USD' || currency === 'CAD' || currency === 'AUD') {
      localizedPrice = $filter('currency')(amount, '$');
    } else if (currency === 'EUR') {
       localizedPrice = $filter('currency')(amount, '€');
    } else if (currency === 'GBP') {
       localizedPrice = $filter('currency')(amount, '£');
    } 

    return localizedPrice;
  };
});




