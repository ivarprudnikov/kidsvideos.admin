'use strict';

angular.module('admin.kidsvideos',
  ['com.ivarprudnikov.ng.youtube',
    'com.ivarprudnikov.ng.validation',
    'com.ivarprudnikov.ng.search',
    'ui.router',
    'ui.bootstrap',
    'ngResource',
    'ngAnimate',
    'ui.keypress',
    'ui.event',
    'ngTouch',
    'appTemplates'
  ])

  .run(function ($rootScope, $timeout, $window, $location) {

    $rootScope.menuIsActive = true;

    $rootScope.currentState = { name : '' };

    $rootScope.$on('$stateChangeStart',
      function (event, toState, toParams, fromState, fromParams) {
        $rootScope.currentState.name = toState.name.replace(/\./g, '_');
        $('body').animate({ scrollTop : 0 }, 100);
      }
    );

    $rootScope.$on('$locationChangeSuccess',
      function (event) {
        var pagePaths, pagePath;

        pagePaths = $window.location.href.split($window.location.host);
        if (pagePaths.length > 1) {
          pagePath = pagePaths[1];
        } else {
          pagePath = '/';
        }

        ga('send', {
          hitType : 'pageview',
          page    : pagePath
        });

      }
    );
  })

  .config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

      var APP_PATH = 'apps/core/';

      $urlRouterProvider.otherwise('/main');

      $stateProvider

        .state('main', {
          url      : '/main',
          abstract : true,
          views    : {
            header : {
              templateUrl : APP_PATH + 'views/header.html',
              controller  : 'HeaderController'
            }
          }
        })
        .state('main.home', {
          url   : '',
          views : {
            'main@' : {
              templateUrl : APP_PATH + 'views/main.home.html',
              controller  : 'HomeController'
            }
          }
        })

        .state('video', {
          url      : '/video',
          abstract : true,
          views    : {
            header : {
              templateUrl : APP_PATH + 'views/header.html',
              controller  : 'HeaderController'
            }
          }
        })
        .state('video.search', {
          url   : '/search?q&t',
          views : {
            'main@' : {
              templateUrl : APP_PATH + 'views/video.search.html',
              controller  : 'VideoController'
            }
          }
        })
        .state('video.approved', {
          url   : '/approved?max&offset',
          views : {
            'main@' : {
              templateUrl : APP_PATH + 'views/video.approved.html',
              controller  : 'ApprovedVideosController'
            }
          }
        })
        .state('video.pending', {
          url   : '/pending?max&offset',
          views : {
            'main@' : {
              templateUrl : APP_PATH + 'views/video.pending.html',
              controller  : 'PendingVideosController'
            }
          }
        })
        .state('video.skipped', {
          url   : '/skipped?max&offset',
          views : {
            'main@' : {
              templateUrl : APP_PATH + 'views/video.skipped.html',
              controller  : 'SkippedVideosController'
            }
          }
        })
        .state('video.search.result', {
          url   : '/result/:id',
          views : {
            'main@' : {
              templateUrl : APP_PATH + 'views/video.preview.html',
              controller  : 'VideoPreviewController'
            }
          }
        })

        .state('playlist', {
          url      : '/playlist',
          abstract : true,
          views    : {
            header : {
              templateUrl : APP_PATH + 'views/header.html',
              controller  : 'HeaderController'
            }
          }
        })
        .state('playlist.list', {
          url   : '/list?query&max&offset&sort&order&isPublic&isApproved&isSkipped&isPending&user',
          views : {
            'main@' : {
              templateUrl : APP_PATH + 'views/playlist.list.html',
              controller  : 'PlaylistListController'
            }
          }
        })
        .state('playlist.show', {
          url   : '/show/:id',
          views : {
            'main@' : {
              templateUrl : APP_PATH + 'views/playlist.show.html',
              controller  : 'PlaylistShowController'
            }
          }
        })
        .state('playlist.create', {
          url   : '/create',
          views : {
            'main@' : {
              templateUrl : APP_PATH + 'views/playlist.create.html',
              controller  : 'PlaylistCreateController'
            }
          }
        })
        .state('playlist.edit', {
          url   : '/edit/:id',
          views : {
            'main@' : {
              templateUrl : APP_PATH + 'views/playlist.edit.html',
              controller  : 'PlaylistEditController'
            }
          }
        })
      ;
    }]);
