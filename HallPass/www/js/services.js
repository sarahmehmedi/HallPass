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







