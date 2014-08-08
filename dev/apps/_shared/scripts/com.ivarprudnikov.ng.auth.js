'use strict';

(function(angular,easyXDM){

  var mod = angular.module('com.ivarprudnikov.ng.auth', [
    'com.ivarprudnikov.ng.config',
    'ui.bootstrap'
  ]);

  mod.factory('authService', ['$window', '$timeout', '$q', '$modal', 'httpBuffer', 'configuration', '$http', function($window, $timeout, $q, $modal, httpBuffer, configuration, $http) {

    function storeToken(token) {
      $window.sessionStorage.token = token;
    }

    function tokenExists() {
      return !!$window.sessionStorage.token;
    }

    function deleteToken() {
      delete $window.sessionStorage.token;
    }

    function preparePromise(promise) {
      promise.success = function(fn) {
        promise.then(fn);
        return promise;
      }
      promise.error = function(fn) {
        promise.then(null, fn);
        return promise;
      }
    }

    return {

      hasToken: function(){
        return tokenExists();
      },

      login: function() {
        var deferred = $q.defer();
        var promise = deferred.promise;

        preparePromise(promise);

        // as operation might have been triggered by invalid token
        deleteToken();

        $modal.open({
          templateUrl: 'views/login.html',
          backdrop: 'static',
          keyboard: false,
          controller: 'LoginModalController'
        }).result.then(function(token) {
            // Success
            storeToken(token);
            httpBuffer.retryAll(function(config) { return config; });
            deferred.resolve();
          }, function(error) {
            // Error
            deleteToken();
            deferred.reject();
          });

        return promise;
      },

      logout: function() {

        var deferred = $q.defer();
        var promise = deferred.promise;
        preparePromise(promise);

        $timeout(function(){
          deleteToken();
          deferred.resolve();
        })

        return promise;
      },

      validate: function(options) {

        var deferred = $q.defer();
        var promise = deferred.promise;
        preparePromise(promise);

        var defaults = {
          ignoreAuthModule:true,
          headers: {}
        };
        defaults.headers[configuration.api.tokenHeaderName] = $window.sessionStorage.token;

        var overrides = {};
        if(angular.isObject(options)){
          overrides = options;
        }
        angular.extend(defaults,overrides)

        $http.post(configuration.api.validateUrl, {}, defaults).success(function(data, status, headers, config) {
          deferred.resolve(data);
        }).error(function(data, status, headers, config) {
          deferred.reject();
        });

        return promise;
      }
    };

  }]);

  /**
   * View for the login modal
   */
  mod.run(['$templateCache', function($templateCache) {
    $templateCache.put('views/login.html',
        '<div class="modal-header">\n' +
        ' <h3 class="modal-title">Sign in</h3>\n' +
        '</div>\n' +
        '<div class="modal-body">\n' +
        '<p>Please sign in using one of the available providers</p>'  +
        ' <form ng-if="formLoginEnabled" role="form">\n' +
        '   <div class="form-group">\n' +
        '     <label for="username">Username</label>\n' +
        '     <input type="text" class="form-control" id="username" placeholder="Enter email" ng-model="username">\n' +
        '   </div>\n' +
        '   <div class="form-group">\n' +
        '     <label for="password">Password</label>\n' +
        '     <input type="password" class="form-control" id="password" placeholder="Password" ng-model="password">\n' +
        '   </div>\n' +
        ' </form>\n' +
        ' <button ng-repeat="p in providers" type="button" class="btn btn-block btn-primary" ng-click="open(p.name)">{{p.name}}</button>\n' +
        '</div>\n' +
        '<div class="modal-footer">\n' +
        // ' <button type="button" class="btn btn-success" ng-click="login()">Login</button>\n' +
        '</div>\n');
  }]);

  mod.controller('LoginModalController', ['$scope', '$modalInstance', 'authProviderService', function($scope, $modalInstance, authProviderService) {

    $scope.providers = [];
    $scope.formLoginEnabled = false;

    function onAuthSuccess(token) {
      $timeout(function(){
        $modalInstance.close(token);
      })
    }

    function onAuthError() {
      console.log("modal error callback TODO, data:", data);
    }

    var auth = {
      proxy : null,
      win : null,
      winName : 'authentication',
      windowFeatures : 'width=400, height=400, menubar=no, location=no, resizable=no, scrollbars=no, status=no"',
      needsAfter : false,
      remote : '',
      timeout : null
    };

    auth.proxy = new easyXDM.Rpc({
      remote : configuration.auth.login, // the path to the page sending provider list
      onReady : function () {
        auth.proxy.getAvailableProviders(function (providerList) {
          $timeout(function(){
            $scope.providers = providerList;
          });
        }, function (errorObj) {
          console.log("getAvailableProviders errorObj", errorObj)
        });
      }
    },
    {
      local : {
        postMessage : function (token) {
          $timeout(function(){
            onAuthSuccess(token);
          });
        }
      },
      remote : {
        getAvailableProviders : {},
        open : {}
      }
    });

    $scope.open = function (providerName) {
      if (auth.win) {
        auth.win.close();
      }
      auth.win = $window.open(configuration.auth.blank, auth.winName, auth.windowFeatures);
      auth.timeout = setTimeout(function () {
        auth.proxy.open(providerName, auth.winName);
      }, 300);
    };


    $scope.username = '';
    $scope.password = '';

    // Actions

    $scope.login = function() {
      $http.post(configuration.api.loginUrl, {
        username: $scope.username,
        password: $scope.password
      }).success(function(data, status, headers, config) {
        onAuthSuccess(data);
      }).error(function(data, status, headers, config) {
        onAuthError();
      });
    };

  }]);

  mod.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push(['$rootScope', '$q', '$window', 'httpBuffer', 'configuration', function($rootScope, $q, $window, httpBuffer, configuration) {
      return {
        request: function(config) {
          config.headers = config.headers || {};
          if($window.sessionStorage.token) {
            config.headers[configuration.api.tokenHeaderName] = $window.sessionStorage.token;
          }
          return config;
        },
        responseError: function(rejection) {
          if(rejection.status === 401 && !rejection.config.ignoreAuthModule) {
            var deferred = $q.defer();
            httpBuffer.append(rejection.config, deferred);
            $rootScope.$broadcast('event:auth-loginRequired', rejection);
            return deferred.promise;
          }
          // otherwise, default behaviour
          return $q.reject(rejection);
        }
      };
    }]);
  }]);

  mod.run(['$rootScope', 'authService', function($rootScope, authService) {
    $rootScope.$on('event:auth-loginRequired', function() {
      authService.login();
    });
  }]);

  mod.factory('httpBuffer', ['$injector', function($injector) {

    /** Holds all the requests, so they can be re-requested in future. */
    var buffer = [];

    /** Service initialized later because of circular dependency problem. */
    var $http;

    function retryHttpRequest(config, deferred) {
      function successCallback(response) {
        deferred.resolve(response);
      }
      function errorCallback(response) {
        deferred.reject(response);
      }
      $http = $http || $injector.get('$http');
      $http(config).then(successCallback, errorCallback);
    }

    return {
      /**
       * Appends HTTP request configuration object with deferred response attached to buffer.
       */
      append: function(config, deferred) {
        buffer.push({
          config: config,
          deferred: deferred
        });
      },

      /**
       * Abandon or reject (if reason provided) all the buffered requests.
       */
      rejectAll: function(reason) {
        if (reason) {
          for (var i = 0; i < buffer.length; ++i) {
            buffer[i].deferred.reject(reason);
          }
        }
        buffer = [];
      },

      /**
       * Retries all the buffered requests clears the buffer.
       */
      retryAll: function(updater) {
        for (var i = 0; i < buffer.length; ++i) {
          retryHttpRequest(updater(buffer[i].config), buffer[i].deferred);
        }
        buffer = [];
      }
    };
  }]);


})(angular,easyXDM);

