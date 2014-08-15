'use strict';

angular.module('io.kidsvideos.admin.main')
  .controller('HomeController', ['$scope', '$rootScope', '$timeout', function ($scope, $rootScope, $timeout, YoutubePlayerService) {

    $scope.doIt = function (n) {
      console.log('doing it', n);
    };

    $scope.$on('$destroy', function () {
    });

  }]);
