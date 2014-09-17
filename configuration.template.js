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
        path: '/api/v1/client',
        videoSearch: '@@apiUrl/api/v1/client/video/search',
        playlistPath: '@@apiUrl/api/v1/client/playlist'
      },
      private: {
        path: '/api/v1/admin',
        videoSearch: '@@apiUrl/api/v1/admin/search/video',
        videoShow: '@@apiUrl/api/v1/admin/video',
        stats: '@@apiUrl/api/v1/admin/stats'
      }
    }
  });

})(angular);