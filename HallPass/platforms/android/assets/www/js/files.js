angular.module('HallPass.services', [])

.factory('Auth', function (FURL, $log, $firebaseAuth, $firebaseArray, $firebaseObject, Utils) {

    firebase.initializeApp(FURL);
    var ref = firebase.database().ref();
    var auth = $firebaseAuth();



    var Auth = {
        user: {},

        login: function (user) {
            return auth.$signInWithEmailAndPassword(
              user.email, user.password
            );
        },

        updateUserEmail: function(user) {
            return auth.$updateEmail(user.email);
            
        },

        updateUserPassword: function(user) {
            return auth.$updatePassword(user.password);
        },

        createProfile: function (uid, user) {
            var profile = {
                
                email: user.email,
                id: uid,
                userName: user.email,
                profilePic: "",
                registered_in: Date()
            };

            var messagesRef = $firebaseArray(firebase.database().ref().child("users"));
            messagesRef.$add(profile);
            $log.log("User Saved");
        },

        register: function (user) {
            return auth.$createUserWithEmailAndPassword(user.email, user.password)
              .then(function (firebaseUser) {
                  console.log("User created with uid: " + firebaseUser.uid);
                  Auth.createProfile(firebaseUser.uid, user);
                  Utils.alertshow("Success!", "Your account has been registered!");
              })
              .catch(function (error) {
                  Utils.alertshow("Error.", "That email address is already in use.");
                  $log.log("Error: " + error);
              });
        },

        logout: function () {
            auth.$signOut();
            $log.log("User Logged Out.");
        },

        resetpassword: function (email) {
            return auth.$sendPasswordResetEmail(
				  email
				).then(function () {
				    Utils.alertshow("Success!", "Your password has been sent to your email.");
				    console.log("Password reset email sent successfully!");
				}).catch(function (error) {
				    Utils.errMessage(error);
				    console.error("Error: ", error.message);
				});
        },
        changePassword: function (user) {
            return auth.$changePassword({ email: user.email, oldPassword: user.oldPass, newPassword: user.newPass });
        },

        signInWithProvider: function (provider) {
            return Auth.signInWithPopup('google');
        },
        saveProfile: function (user) {
            localStorage.setItem("HallPass.current_user", JSON.stringify(user));
        },
        getProfile: function () {
            var user = localStorage.getItem("HallPass.current_user");
            return user && JSON.parse(user);
        }

    };
    return Auth;
})

.factory('Utils', function ($ionicLoading, $ionicPopup) {

    var Utils = {

        show: function () {
            $ionicLoading.show({
                animation: 'fade-in',
                showBackdrop: false,
                maxWidth: 200,
                showDelay: 500,
                template: '<p class="item-icon-left">' + "Loading..." + '<ion-spinner icon="lines"/></p>'
            });
        },

        hide: function () {
            $ionicLoading.hide();
        },

        alertshow: function (tit, msg) {
            var alertPopup = $ionicPopup.alert({
                title: tit,
                template: msg
            });
            alertPopup.then(function (res) {
            });
        },

        errMessage: function (err) {

            var msg = "Unknown Error...";

            if (err && err.code) {
                switch (err.code) {
                    case "EMAIL_TAKEN":
                        msg = "This Email has been taken."; break;
                    case "INVALID_EMAIL":
                        msg = "Invalid Email."; break;
                    case "NETWORK_ERROR":
                        msg = "Network Error."; break;
                    case "INVALID_PASSWORD":
                        msg = "Invalid Password."; break;
                    case "INVALID_USER":
                        msg = "Invalid User."; break;
                }
            }
            Utils.alertshow("Error", msg);
        },
    };
    return Utils;
})
.factory('FileService', function() {
  var images;
  var IMAGE_STORAGE_KEY = 'dav-images';
 
  function getImages() {
    var img = window.localStorage.getItem(IMAGE_STORAGE_KEY);
    if (img) {
      images = JSON.parse(img);
    } else {
      images = [];
    }
    return images;
  };
 
  function addImage(img) {
    images.push(img);
    window.localStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify(images));
  };
 
  return {
    storeImage: addImage,
    images: getImages
  }
})

.factory('ImageService', function($cordovaCamera, FileService, $q, $cordovaFile) {
    
  function optionsForType(type) {
    var source;
    switch (type) {
      case 0:
        source = Camera.PictureSourceType.CAMERA;
        break;
      case 1:
        source = Camera.PictureSourceType.PHOTOLIBRARY;
        break;
    }
    return {
    quality: 90,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: source,
      allowEdit: false,
      encodingType: Camera.EncodingType.JPEG,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
    correctOrientation:true
    };
  }
 
  function saveMedia(type) {
    return $q(function(resolve, reject) {
      var options = optionsForType(type);
 
      $cordovaCamera.getPicture(options).then(function(imageBase64) {   
      FileService.storeImage(imageBase64);    
    });
    })
  }
  return {
    handleMediaDialog: saveMedia
  }
})

.factory('Forums', function (FURL, $firebaseArray, $firebaseAuth, Auth, Utils) {
    // Might use a resource here that returns a JSON array

    var forums = [];
    var i = 0;
    return {
        all: function () {
            //  var rooms = $firebaseArray(ref.child('chats'));
            //var chatRef = firebase.database().ref('chats');
            // var ref = firebase.database().ref();
            // var auth = $firebaseAuth();
            // var messagesRef = $firebaseArray(firebase.database().ref().child("chats"));

            // var convertedStrings = JSON.stringify(chats);
            // var tests= JSON.parse(convertedStrings);
            // console.log(messagesRef);
            return forums;
        },
        add: function (id, classname, location, date) {
            forums[i++] = { 'id': id, 'classname': classname, 'location': location, 'date': date };

        },
        remove: function (forum) {
            forums.splice(forums.indexOf(forum), 1);
        },
        get: function (forumId) {
            for (var i = 0; i < forums.length; i++) {
                if (forums[i].id === parseInt(forumId)) {
                    return forums[i];
                }
            }
            return null;
        }
    };
});


angular.module('HallPass.controllers', [])

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

.controller("NotesCtrl", function($scope) {
 
    $scope.images = [];
 
    $scope.loadImages = function() {
        for(var i = 0; i < 100; i++) {
            $scope.images.push({id: i, src: "http://placehold.it/50x50"});
        }
    }
 
})

.controller('ImageController', function($scope, $cordovaDevice, $cordovaFile, $ionicPlatform, $cordovaEmailComposer, $ionicActionSheet, ImageService, FileService) {
 
  $ionicPlatform.ready(function() {
    $scope.images = FileService.images();
    $scope.$apply();
  });
 
  $scope.addMedia = function() {
    $scope.hideSheet = $ionicActionSheet.show({
      buttons: [
        { text: 'Take photo' },
        { text: 'Photo from library' }
      ],
      titleText: 'Add images',
      cancelText: 'Cancel',
      buttonClicked: function(index) {
        $scope.addImage(index);
      }
    });
  }
 
  $scope.addImage = function(type) {
    $scope.hideSheet();
    ImageService.handleMediaDialog(type).then(function() {
      $scope.$apply();
    });
  }
  
  $scope.sendEmail = function() {
    if ($scope.images != null && $scope.images.length > 0) {
      var mailImages = [];
      var savedImages = $scope.images;
    for (var i = 0; i < savedImages.length; i++) {
          mailImages.push('base64:attachment'+i+'.jpg//' + savedImages[i]);
        }
      $scope.openMailComposer(mailImages);
    }
  }
 
  $scope.openMailComposer = function(attachments) {
    var bodyText = '<html><h2>My Images</h2></html>';
    var email = {
        to: '',
        attachments: attachments,
        subject: 'Devdactic Images',
        body: bodyText,
        isHtml: true
      };
 
    $cordovaEmailComposer.open(email, function(){
    console.log('email view dismissed');                            
  }, this);
  }
})

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



<ion-view view-title="Notes" name="dashboard-view">

    <ion-nav-buttons side="left">
        <button class="button icon-left ion-log-out button-stable" ng-click="logOut()">Logout</button>
    </ion-nav-buttons>

    <ion-content class="padding" ng-init="loadImages()">
    <a class="button ion-button full" ng-click="addMedia()">Full Button</a

    <br><br>

        <ion-scroll direction="x" style="height:200px; min-height: 200px; overflow: scroll; white-space: nowrap;">
      <img ng-repeat="image in images" ng-src="data:image/jpeg;base64,{{image}}" style="height:200px; padding: 5px 5px 5px 5px;"/>
    </ion-scroll>  

    <div class="row" ng-repeat="image in images" ng-if="$index % 4 === 0">
        <div class="col col-25" ng-if="$index < images.length">
            <img ng-src="{{images[$index].src}}" width="100%" />
        </div>
        <div class="col col-25" ng-if="$index + 1 < images.length">
            <img ng-src="{{images[$index + 1].src}}" width="100%" />
        </div>
        <div class="col col-25" ng-if="$index + 2 < images.length">
            <img ng-src="{{images[$index + 2].src}}" width="100%" />
        </div>
        <div class="col col-25" ng-if="$index + 3 < images.length">
            <img ng-src="{{images[$index + 3].src}}" width="100%" />
        </div>
    </div>

        </ion-content>
</ion-view>





