// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('HallPass', ['ionic', 'ngMockE2E'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (cordova.platformId === "ios" && window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function ($stateProvider, $urlRouterProvider, USER_ROLES) {
    $stateProvider

    .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginController'
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
                templateUrl: 'templates/forum.html',
                controller: 'DashController'
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
                templateUrl: 'templates/map.html'
            }
        },
        data: {
            authorizedRoles: [USER_ROLES.admin]
        }
    })
    .state('main.settings', {
        url: 'main/settings',
        views: {
            'settings-tab': {
                templateUrl: 'templates/settings.html'
            }
        }
    });

    
    $urlRouterProvider.otherwise(function ($injector, $location) {
        var $state = $injector.get("$state");
        $state.go("main.forum");
    });
})


.run(function ($httpBackend) {
    $httpBackend.whenGET('http://localhost:8100/valid')
          .respond({ message: 'This is my valid response!' });
    $httpBackend.whenGET('http://localhost:8100/notauthenticated')
          .respond(401, { message: "Not Authenticated" });
    $httpBackend.whenGET('http://localhost:8100/notauthorized')
          .respond(403, { message: "Not Authorized" });

    $httpBackend.whenGET(/templates\/\w+.*/).passThrough();
})