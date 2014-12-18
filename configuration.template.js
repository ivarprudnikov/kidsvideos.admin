'use strict';

(function(angular){
  var app = angular.module('com.ivarprudnikov.ng.config', []);

  app.constant('configuration', {
    app: {
      baseUrl: '@@appUrl'
    },
    auth: {
      blank: '@@apiUrl/api/auth/blank',
      login: '@@apiUrl/api/auth/login',
      tokenHeaderName: 'Authorization',
      socialEnabled: false,
      formEnabled: true
    },
    api: {
      baseUrl: '@@apiUrl',
      public: {
        path: '/api/v1/user/guest',
        videoSearch: '@@apiUrl/api/v1/user/guest/video/search'
      },
      admin: {
        path: '/api/v1/user/admin',
        playlist: '@@apiUrl/api/v1/user/admin/playlist',
        search: '@@apiUrl/api/v1/user/admin/search',
        video: '@@apiUrl/api/v1/user/admin/video',
        stats: '@@apiUrl/api/v1/user/admin/stats'
      }
    }
  });

})(angular);
