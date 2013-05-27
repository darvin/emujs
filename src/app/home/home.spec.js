/**
 * Tests sit right alongside the file they are testing, which is more intuitive
 * and portable than separating `src` and `test` directories. Additionally, the
 * build process will exclude all `.spec.js` files from the build
 * automatically.
 */
describe( 'home section', function() {
  beforeEach( module( 'ngBoilerplate.home' ) );


  describe( 'HomeCtrl hosting', function() {
    var ctrl, $location, $scope;
    beforeEach( inject( function( $controller, $rootScope ) {
      $scope = $rootScope.$new();
      ctrl = $controller( 'HomeCtrl', { $scope: $scope });
    }));


    it("should be initialized properly", inject(function() {
 
      expect( $scope.hostUserId).toBeTruthy();
      expect($scope.hostUserId).toEqual($scope.userId);

    }));

  });

  describe( 'HomeCtrl connected', function() {
    var ctrl, $location, $scope;
    beforeEach( inject( function( $controller, $rootScope ) {
      $scope = $rootScope.$new();
      var $routeParams ={
        userId:"HostingUserId"
      };
      ctrl = $controller( 'HomeCtrl', { $scope: $scope, $routeParams:$routeParams });
    }));


    it("should be initialized properly", inject(function() {
 
      expect( $scope.hostUserId).toBeTruthy();
      expect($scope.hostUserId).not.toEqual($scope.userId);

    }));

  });

});

