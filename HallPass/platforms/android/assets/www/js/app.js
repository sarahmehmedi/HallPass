angular.module('HallPass', ['ionic', 'HallPass.services', 'HallPass.controllers', 'HallPass.constants','ngStorage', 'ngCordova', 'firebase', 'ngMessages'])

.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function (FURL) {
        if (cordova.platformId === "ios" && window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})

.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginController'
    })

    .state('register', {
        url: '/register',
        templateUrl: 'templates/register.html',
        controller: 'RegisterController'
    })

    .state('forgot', {
        url: '/forgot',
        templateUrl: 'templates/forgot.html',
        controller: 'ForgotController'
    })
    //to testing what it looks like on browser
    .state('addPost',{
        url: '/addPost',
        templateUrl: 'templates/addPost.html',
        //controller: 'AddPostCtrl'
    })

    .state('main', {
        url: '/',
        abstract: true,
        templateUrl: 'templates/main.html'
    })

    .state('main.forum', {
        url: 'main/forum',
        views: {
            'forum-tab': {
                templateUrl: 'templates/forumsList.html',
                controller: 'ForumCtrl'
            }
        }
    })


    .state('main.chat-detail', {
        url: 'main/forum/chat-detail/:chatId',
        views: {
            'forum-tab': {
                templateUrl: 'templates/chat-detail.html',
                controller: 'ChatDetailCtrl'
            }
        }
    })

    .state('main.account',{
        url: 'main/forum/account',
        views: {
            'tab-account': {
                templateUrl: 'templates/tab-account.html',
                controller: 'AccountCtrl'
            }
        }
    })

    .state('main.notes', {
        url: 'main/notes',
        views: {
            'notes-tab': {
                templateUrl: 'templates/notes.html'
            }
        }
    })

    .state('main.map', {
        url: 'main/map',
        views: {
            'map-tab': {
                templateUrl: 'templates/map.html',
                controller: 'MapController'
            }
        }
    })

    .state('main.settings', {
        url: 'main/settings',
        views: {
            'settings-tab': {
                templateUrl: 'templates/settings.html',
                controller: 'SettingsController'
            }
        },
    });

    $urlRouterProvider.otherwise('/login');
});