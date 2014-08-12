'use strict';

angular.module('admin.kidsvideos')
  .controller('HeaderController', ['$scope', '$window', 'authService',
    function ($scope, $window, authService) {

      $scope.hasToken = function(){
        return authService.hasToken();
      };

      $scope.signIn = function(){
        authService.login().success(function(){
          $window.location.reload();
        });
      };

      $scope.signOut = function(){
        authService.logout().success(function(){
          $window.location.reload();
        });
      };

    }]);
