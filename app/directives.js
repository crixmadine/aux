'use strict';

var app = angular.module('auxApp');


//TODO: pass in the controller object to make directive more generic
// see chapeter on FB and directives. 
// Not sure if the isolated scope will be an issue.
app.directive('artistData', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'views/search/releases.html'
  };
});

/* this directive fade's in images once they loaded */
/* make sure to set 'class=fade' on img element which utilizes bootstraps fade css */
app.directive('imgPreload', ['$rootScope', function($rootScope) {
  return {
    restrict: 'A',
    scope: {
      ngSrc: '@'
    },
    link: function(scope, element, attrs) {
      element.on('load', function() {
        element.addClass('in');
      }).on('error', function() {
        //
      });

      scope.$watch('ngSrc', function(newVal) {
        element.removeClass('in');
      });
    }
  };
}]);
