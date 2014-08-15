'use strict';

angular.module('io.kidsvideos.admin.main')
  .controller('PlaylistShowController', ['$scope', '$state', '$stateParams', '$interval', 'PlaylistFactory',
    function ($scope, $state, $stateParams, $interval, PlaylistFactory) {

      var messageInterval = null,
        msg0 = 'Loading playlist',
        msg1 = 'Still loading',
        msg2 = 'Takes longer than usual',
        msgErr = 'Error occured while loading playlist';

      $scope.id = $stateParams.id || '';

      $scope.loadingMessage = '';
      $scope.playlist = null;

      $scope.$watch($stateParams, function () {
        loadPlaylist();
      });

      function stopMessageInterval() {
        if (angular.isDefined(messageInterval)) {
          $scope.loadingMessage = '';
          $interval.cancel(messageInterval);
        }
      }

      function startLoadingMessage() {
        $scope.loadingMessage = msg0;
        messageInterval = $interval(function () {
          if ($scope.loadingMessage === msg0) {
            $scope.loadingMessage = msg1;
          } else if ($scope.loadingMessage === msg1) {
            $scope.loadingMessage = msg2;
          } else {
            $scope.loadingMessage += '.';
          }
        }, 7000);
      }

      function errorHandler(httpResponse) {
        stopMessageInterval();
        $scope.loadingMessage = msgErr;
      }

      function loadPlaylist() {
        if ($scope.id) {
          startLoadingMessage();
          $scope.playlist = PlaylistFactory.show({id : $scope.id}, null, function (responseData, responseHeaders) {
            stopMessageInterval();
          }, errorHandler);
        }
      }

      $scope.$on('$destroy', function () {
      });

    }]);
