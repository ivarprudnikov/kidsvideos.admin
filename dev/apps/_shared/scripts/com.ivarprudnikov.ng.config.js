'use strict';

(function(angular){
  var app = angular.module('com.ivarprudnikov.ng.config', [])

  app.constant('configuration', {
    auth: {
      blank: 'http://localhost:3000/api/auth/blank',
      login: 'http://localhost:3000/api/auth/login'
    },
    api: {
      baseUrl: 'http://localhost:3000/api/',
      tokenHeaderName: 'Authorization'
    }
  });

})(angular)

