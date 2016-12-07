angular.module('HallPass.controllers', [])



.controller('LoginController', function ($scope, $state, $cordovaOauth, $localStorage, $location, $http, $ionicPopup, $firebaseAuth, $firebaseObject, $log, Auth, FURL, Utils) {

    var auth = $firebaseAuth();
    var ref = firebase.database().ref();
    var userkey = "";

    $scope.signIn = function (user) {
        // $log.log("Sent");
        if (angular.isDefined(user)) {
            Utils.show();
            Auth.login(user)
              .then(function (authData) {

                  // $log.log("User ID:" + authData);
                  Utils.hide();
                  $state.go('main.forum');
                  $scope.setCurrentUsername(data.username);
                  //$log.log("Starter page","Home");

              }, function (err) {
                  Utils.hide();
                  Utils.errMessage(err);
              });
        }
    };

    $scope.checkUser = function () {
        var firebaseUser = auth.$getAuth();

        if (firebaseUser) {
            //$log.log("Signed in as:", firebaseUser.uid);
            $state.go('main.forum');
        } else {
            //$log.log("Signed out");
            //$location.path("/login");
            $state.go('login');
        }

    }

})

.controller('RegisterController', function ($scope, $state, $cordovaOauth, $localStorage, $location, $http, $ionicPopup, $firebaseObject, Auth, FURL, Utils) {

    $scope.register = function (user) {
        if (angular.isDefined(user)) {
            Utils.show();
            Auth.register(user)
              .then(function () {
                  Utils.hide();
                  console.log("Before Logging In:" + JSON.stringify(user));
                  $location.path('/');
              }).catch(function (error) {
                  $log.log("Error: " + error);
              });
        }
    };

})

.controller('ForgotController', function ($scope, $state, $cordovaOauth, $localStorage, $location, $http, $ionicPopup, $firebaseObject, Auth, FURL, Utils) {

    $scope.resetpassword = function (user) {
        if (angular.isDefined(user)) {
            Auth.resetpassword(user.email)
              .then(function () {
                  //console.log("Password reset email sent successfully!");
                  $location.path('/login');
              }, function (err) {
                  //console.error("Error: ", err);
              });
        }
    };
})

// .controller('ForumController', function($scope, $ionicListDelegate, Posts){
//     $scope.posts = Posts;

//     $scope.addPost = function (){
//       var name = prompt('List class, date, time, location of study session.');
//       if(name) {
//         $scope.posts.$addPost({
//           'name' : name
//         });
//       }

//     }
// });

.controller('ForumController', function ($scope, $state, Items, $cordovaOauth, $localStorage, $log, $location, $http, $ionicPopup, $firebaseObject, $firebaseAuth, Auth, FURL, Utils) {
    var ref = firebase.database().ref();
    $scope.authObj = $firebaseAuth();

    $scope.logOut = function () {
        Auth.logout();
        $state.go('login');
    };
    $scope.items = Items.all();
    
});
