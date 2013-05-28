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
  'p2pService',
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
.controller( 'HomeCtrl', function HomeController( $scope, $location, $routeParams, titleService, p2pService ) {
  titleService.setTitle( 'Home' );
  if (!$routeParams.userId) {
    $scope.hostUserId = "someUserId"; 
    $scope.userId = "someUserId"; 
    $scope.isHost = true;

  } else {
    $scope.hostUserId = $routeParams.userId; 
    $scope.userId = "newUserId";
    $scope.isHost = false;

  }

  $scope.location = $scope.hostUserId;
        //$location.absUrl();


  $scope.chat = {
    messages:[],
    messageText:""

  };


  var p2pClient = p2pService.createClient($scope.userId, {
    onReceived: function(userId, data) {
      $scope.chat.messages.push({user:userId, text:data});
    },
    onConnected: function(userId) {
      console.log("Connected: "+userId);
    }
  });
  if (!$scope.isHost && $scope.hostUserId) {
    p2pClient.connect($scope.hostUserId);
  }

  $scope.chat.addMessage = function() {
    p2pClient.send($scope.chat.messageText);
  };
  

})

;

