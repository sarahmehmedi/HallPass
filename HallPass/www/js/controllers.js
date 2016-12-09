﻿angular.module('HallPass.controllers', [])

.controller('SettingsController', function ($scope, $state, $firebaseArray,  $http, $ionicPopup, $firebaseAuth, $firebaseObject, $log, Auth, FURL, Utils) {
         
    $scope.updateUser = function(user)
    {
        if (angular.isDefined(user)) {
            Auth.updateUserEmail(user).then(function () {
                console.log("Email changed successfully!");
            }).catch(function (error) {
                console.error("Error: ", error);
            });
        }
    }

    $scope.updatePass = function(user)
    {
        if (angular.isDefined(user)) {
            Auth.updateUserPassword(user).then(function () {
                console.log("Password changed successfully!");
            }).catch(function (error) {
                console.error("Error: ", error);
            });
        }

    }

    $scope.logOut = function () {
        Auth.logout();
        $state.go('login');
    };
})

.controller('LoginController', function ($scope, $state, $cordovaOauth, $localStorage, $location, $http, $ionicPopup, $firebaseAuth, $firebaseObject, $state, $log, Auth, FURL, Utils) {

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
                  // $scope.setCurrentUsername("test");
                  //var username = $scope.setCurrentUsername(data.username);
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
//remember to add Auth, etc into here so logout works
.controller('ForumCtrl', function ($scope, Forums, $ionicModal, Auth, $state) {

    //test data
    Forums.add(0, "COMP 322", 'Crown Center rm 201, 4pm', '12/2/2016, 2:00am');
    Forums.add(1, 'COMP 374', 'IC rm 212 at 3', '12/1/2016, 6:30pm');
    Forums.add(2, 'THEO 120', 'Meeting at Cuneo 123', '11/1/2016, 2:00am');


    $scope.forums = Forums.all();
    $scope.remove = function (forum) {
        Forums.remove(forum);
    };

    $ionicModal.fromTemplateUrl('templates/addPost.html',
      {
          scope: $scope
      }).then(function (modal) {
          $scope.modal = modal;
      });

    $scope.addPosts = function (classname, location, date) {
        var date = new Date();
        var id = 5;
        console.log(classname + location + date);
        Forums.add(id++, classname, location, date);
        $scope.modal.hide();
    };

    $scope.logOut = function () {
        Auth.logout();
        $state.go('login');
    };
})
/*
.controller('ChatDetailCtrl'['$scope', '$stateParams', 'Forums', function($scope, $stateParams, Chats){
  console.log("ChatDetailCtrl arrived")
  var chatId = $stateParams.id;
  $scope.chat = Chats.get(chatId);
}])

*/
// .controller('AddPostCtrl',['$scope', '$state','SessionData', '$firebase', function($scope, $state, SessionData, $firebase){
//   $scope.showUserHome = function(){
//     $state.go('main.forum');
//   }

//   $scope.user = {};

//   $scope.add = function(){
//     var firebaseObject = new Firebase("https://hallpass-66cd0.firebaseio.com/posts")
//     var fb = $firebase(firebaseObject);
//     var user = SessionData.getUser();

//     fb.$push({
//       post: $scope.user.post,
//       email: user
//     }).then(function(ref){
//       console.log(ref);
//      $state.go('main.forum');
//     }, function(error){
//         console.log("Error:", error);
//     });
//   }

// }])



// .controller('ForumController', ['$scope','$state', function($scope,$state){
//  //SessionData.setUser(user);

//   $scope.showAddPost = function(){
//     $state.go('addPost');
//   }

//   var firebaseObject = new Firebase("https://hallpass-66cd0.firebaseio.com/posts");

//   var sync = firebaseObject.set((firebaseObject);
//   $scope.posts = sync.$firebaseArray();
// }])


// .controller('ForumController', function ($scope, $state, $cordovaOauth, $localStorage, $log, $location, $http, $ionicPopup, $firebaseObject, $firebaseAuth, Auth, FURL, Utils, Items) {
//     var ref = firebase.database().ref('items');
//     console.log(ref);
//     $scope.authObj = $firebaseAuth();


//     $scope.items = Items;
//     $scope.addPost = function(){
//       var name = prompt('Where is study group?');
//       if(name){
//         $scope.items.$add({
//           'name': name
//         });
//       }
//     };

//     $scope.recentPosts = function(item){
//       var itemRef = firebase.database().ref('items/'+item.$id);
//       // itemRef.child('status').set('recent');

//     }
//     $scope.logOut = function () {
//         Auth.logout();
//         $state.go('login');
//     };

// })


.controller('MapController', function ($scope, $ionicLoading, $compile, Auth, $state) {
    function initialize() {
        var myLatlng = new google.maps.LatLng(41.999005, -87.657135);

        var mapOptions = {
            center: myLatlng,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"),
            mapOptions);
        //TODO 
        //Marker + infowindow + angularjs compiled ng-click
        var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
        var compiled = $compile(contentString)($scope);

        var infowindow = new google.maps.InfoWindow({
            content: compiled[0]
        });

        var marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            title: 'Current Location'
        });

        google.maps.event.addListener(marker, 'click', function () {
            infowindow.open(map, marker);
        });

        $scope.map = map;
    }
    google.maps.event.addDomListener(window, 'load', initialize);

    $scope.centerOnMe = function () {
        if (!$scope.map) {
            return;
        }

        $scope.loading = $ionicLoading.show({
            content: 'Getting current location...',
            showBackdrop: false
        });

        navigator.geolocation.getCurrentPosition(function (pos) {
            $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            $scope.loading.hide();
        }, function (error) {
            alert('Unable to get location: ' + error.message);
        });
    };
    //TODO
    $scope.clickTest = function () {
        alert('Example of infowindow with ng-click')
    };

    $scope.logOut = function () {
        Auth.logout();
        $state.go('login');
    };
});



//OLD CODE FOR MAP - REMOVE WHEN TURNING IN
  // google.maps.event.addDomListener(window, "load", function(){
  //   var myLatlng = new google.maps.LatLng(41.999005, -87.657135);

  //   var mapOptions = {
  //     center: myLatlng,
  //     zoom: 16,
  //     mapTypeId: google.maps.MapTypeId.ROADMAP
  //   };

  //   var map = new google.maps.Map(document.getElementById("map"), mapOptions);
    
  //   navigator.geolocation.getCurrentPosition(function(pos){
  //     $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));

  //   })

  //   $scope.map = map;
  // });
  // $scope.mapCreated = function(map){
  //   var latlngPlace = new google.maps.LatLng(41.999005, -87.657135);
  //       var marker = new google.maps.Marker({
  //           map: map,
  //           position: latlngPlace
  //   });

  // $scope.map = map;
  // };



// .controller('MapController', function($scope, $cordovaGeolocation, $ionicLoading, $ionicPlatform) {
     
//     $ionicPlatform.ready(function() {
         
//         $ionicLoading.show({
//             template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location!'
//         });
         
//         var posOptions = {
//             enableHighAccuracy: true,
//             timeout: 20000,
//             maximumAge: 10000
//         };
//         $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
//             var lat  = position.coords.latitude;
//             var long = position.coords.longitude;
             
//             var myLatlng = new google.maps.LatLng(lat,long);
             
//             var mapOptions = {
//                 center: myLatlng,
//                 zoom: 16,
//                 mapTypeId: google.maps.MapTypeId.ROADMAP
//             };          
             
//             var map = new google.maps.Map(document.getElementById("map"), mapOptions);          
             
//             $scope.map = map;   
//             $ionicLoading.hide();           
             
//         }, function(err) {
//             $ionicLoading.hide();
//             console.log(err);
//         });

//     });  
                 
// });

