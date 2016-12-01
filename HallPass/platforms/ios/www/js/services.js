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

        createProfile: function (uid, user) {
            var profile = {
                id: uid,
                email: user.email,
                registered_in: Date()
            };

            //Remember to modify the register.index fields and map to a more extensive profile variable like this
            /*            
            var profile = {
                      id: uid,
              name: user.name,
              lastname: user.lastname,
              address: user.address,
              email: user.email,
                      registered_in: Date()
            };*/
            

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
        saveProfile: function(user){
          localStorage.setItem("HallPass.current_user", JSON.stringify(user));
        },
        getProfile: function(){
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

.factory("Message", function($firebaseArray, Rooms, Auth, $q, md5){
  var selectedRoomId;
  var chatMessagesForRoom;
  var ref = firebase.database().ref();
  return{
    get: function(roomId){
      chatMessagesForRoom = $firebaseArray(ref.child('room-messages').child(roomId).orderByChild("createdAt"));
      return chatMessagesForRoom;
    },
    remove: function(chat){
      chatMessagesForRoom.$remove(chat).then(function(ref){
        ref.key() === chat.$id;
      });
    }
  }
})
.factory("Rooms", function($firebaseArray, Auth){
  var currentUser = Auth.getProfile();
  var ref = firebase.database().ref();
  var rooms = $firebaseArray(ref.child('rooms'));
  return{
    all: function(){
      rooms.$loaded().then(function(response){
        angular.forEach(response, function(room){
          ref.child('room-messages').child(room.$id)
          .orderByChild("createdAt")
          .limitToLast(1)
          .on("child_added", function(snapshot){
            room["last_message_content"] = snapshot.val().content;
          });
        })
      });
      return rooms;
    },

    get: function(roomId){
      return rooms.$getRecord(roomId);
    },
    save: function(room){
      room.createdAt = Firebase.ServerValue.TIMESTAMP;
      room.ownerId = currentUser.id;
      rooms.$add(room);

    }
  }
})
// .factory("Items", function($firebaseArray) {
//   var itemsRef = new Firebase("https://<YOUR-FIREBASE-APP>.firebaseio.com/items");
//   return $firebaseArray(itemsRef);
// })
.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});





