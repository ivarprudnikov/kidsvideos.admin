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
        videoSearch: '@@apiUrl/api/v1/client/video/search'
      },
      private: {
        path: '/api/v1/admin',
        playlist: '@@apiUrl/api/v1/user/admin/playlist',
        videoSearch: '@@apiUrl/api/v1/admin/search/video',
        videoShow: '@@apiUrl/api/v1/admin/video',
        stats: '@@apiUrl/api/v1/admin/stats'
      }
    }
  });

})(angular);
