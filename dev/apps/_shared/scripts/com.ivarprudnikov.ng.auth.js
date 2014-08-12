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

    var logInPromise = null;

    return {

      hasToken: function(){
        return tokenExists();
      },

      login: function() {

        if(logInPromise) {
          return logInPromise;
        }

        var deferred = $q.defer();
        var promise = logInPromise = deferred.promise;

        preparePromise(promise);

        // as operation might have been triggered by invalid token
        deleteToken();

        $modal.open({
          templateUrl: 'views/login.html',
          backdrop: 'static',
          keyboard: false,
          controller: 'LoginModalController'
        }).result.then(function(token) {

            console.log("$modal success")

            // Success
            storeToken(token);
            httpBuffer.retryAll(function(config) { return config; });
            deferred.resolve();
          }, function(error) {

            console.log("$modal error")

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
        '<div ng-if="formLoginPath || providers.length" class="modal-header">\n' +
        ' <h3 class="modal-title">Sign in</h3>\n' +
        '</div>\n' +
        '<div ng-if="formLoginPath || providers.length" class="modal-body">\n' +
        ' <form ng-if="formLoginPath" role="form">\n' +
        '   <div class="form-group">\n' +
        '     <label for="username">Username</label>\n' +
        '     <input type="text" class="form-control" id="username" placeholder="Enter email" ng-model="user.username">\n' +
        '   </div>\n' +
        '   <div class="form-group">\n' +
        '     <label for="password">Password</label>\n' +
        '     <input type="password" class="form-control" id="password" placeholder="Password" ng-model="user.password">\n' +
        '   </div>\n' +
        ' </form>\n' +
        ' <p ng-if="providers && providers.length">Please sign in using one of the available providers</p>'  +
        ' <button ng-repeat="p in providers" type="button" class="btn btn-block btn-primary" ng-click="open(p.name)">{{p.name}}</button>\n' +
        '</div>\n' +
        '<div class="modal-footer">\n' +
        ' <button type="button" class="btn btn-link" ng-click="cancelModal()">Cancel</button>' +
        ' <button ng-if="formLoginPath" type="button" class="btn btn-default" ng-click="login()">Login</button>\n' +
        '</div>\n' +
          '<div ng-if="!formLoginPath && !providers.length" class="modal-body">' +
          '<div class="text-danger">No connection to the server, check if you are connected to internet.</div>' +
          '</div>');
  }]);

  mod.controller('LoginModalController', ['$window', '$timeout', '$scope', '$modalInstance', 'configuration', '$http',
    function($window, $timeout, $scope, $modalInstance, configuration, $http) {

    $scope.providers = [];
    $scope.formLoginEnabled = false;
    $scope.formLoginPath = '';
      $scope.user = {
        username:'',
        password:''
      }

      $scope.$watch('username',function(){
        console.log("$scope.username",$scope.user)
      })


    function onAuthSuccess(token) {
      $timeout(function(){
        $modalInstance.close(token);
      })
    }

    function onAuthError() {
      console.log("modal error callback");
    }

    $scope.cancelModal = function(){
      $modalInstance.dismiss();
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

        auth.proxy.formLoginPath(function (formLoginPath) {
          $timeout(function(){
            $scope.formLoginPath = formLoginPath;
          });
        }, function (errorObj) {
          console.log("formLoginPath errorObj", errorObj)
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
        formLoginPath : {},
        open : {}
      }
    });

    $scope.open = function (providerName) {
      if (auth.win) {
        auth.win.close();
      }
      auth.win = $window.open(configuration.auth.blank, auth.winName, auth.windowFeatures);
      if(auth.win){
        auth.timeout = setTimeout(function () {
          auth.proxy.open(providerName, auth.winName);
        }, 300);
      } else {
        onAuthError();
      }

    };


    // Actions

    $scope.login = function() {
      if($scope.formLoginPath) {

        $http.post($scope.formLoginPath, $scope.user, {
          headers:{
            'X-Requested-With':'kidsvideos'
          }
        }).success(function (data, status, headers, config) {
          $scope.username = '';
          $scope.password = '';
          onAuthSuccess(data.token);
        }).error(function (data, status, headers, config) {
          onAuthError();
        });
      }
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

