/**
 * Each section of the site has its own module. It probably also has
 * submodules, though this boilerplate is too simple to demonstrate it. Within
 * `src/app/home`, however, could exist several additional folders representing
 * additional modules that would then be listed as dependencies of this one.
 * For example, a `note` section could have the submodules `note.create`,
 * `note.delete`, `note.edit`, etc.
 *
 * Regardless, so long as dependencies are managed correctly, the build process
 * will automatically take take of the rest.
 *
 * The dependencies block here is also where component dependencies should be
 * specified, as shown below.
 */
angular.module( 'ngBoilerplate.home', [
  'titleService',
  'plusOne'
])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $routeProvider ) {
  var homeRoute = {
    controller: 'HomeCtrl',
    templateUrl: 'home/home.tpl.html'
  };
  $routeProvider.when( '/home', homeRoute);

  $routeProvider.when( '/home/:userId', homeRoute);
})

/**
 * And of course we define a controller for our route.
 */
.controller( 'HomeCtrl', function HomeController( $scope, $location, $routeParams, titleService ) {
  titleService.setTitle( 'Home' );
  $scope.location = $location.absUrl();
  if (!$routeParams.userId) {
    $scope.hostUserId = "someUserId"; 
    $scope.userId = "someUserId"; 

  } else {
    $scope.hostUserId = $routeParams.userId; 
    $scope.userId = "somenew userId";

  }
})

;

