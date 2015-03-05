'use strict';

describe('auxApp.wantlist module', function() {
  beforeEach(module('auxApp.wantlist'));
   
  describe('wantlist controller', function() {
    
  /*
    beforeEach(function() {
      module(function($controllerProvider) {
        $controllerProvider.register('WantlistCtrl', function($scope) {
          // Mocking WantlistCtrl
          //$scope.someVariable = SOME_VARIABLE;
          //$scope.someFunction = function() {  
            //do something
          //}; 
        });
      });
    });
  */

    var scope, controller;
    
    beforeEach(inject(function ($rootScope, $controller) {
      scope = $rootScope.$new();
      controller = $controller;
    }));
  
    it('should do something', function() {
      controller('WantlistCtrl', {$scope: scope});
      //expect(scope.message).toBe("Hello World");
    });

    /*
	  it('should be defined', inject(function() {
      //spec body
      wantlistCtrl('WantlistCtrl', {$scope: $scope});
      expect(wantlistCtrl).toBeDefined();
    }));
    */

  });



  describe('wantlist service', function() {
	  beforeEach(function() {
	    //module('auxApp.wantlist');
		  
		  module(function($provide) {
		    //Mock wantlistService
		    $provide.factory('wantlistService', function() {
		      // Mocking wantlistService
          /*
		      return {
            doSomething: function() {}
          }
          */
		    });
		 
		    //$provide.service('storageSvc', function() {
		      // Mocking storageSvc
		    //});
		  });
	  });

	  /*
	  it('should be defined', inject(function() {
      //spec body
      
    }));
    */
  });
});