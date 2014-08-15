'use strict';

/* jshint eqeqeq:false,eqnull:true */

angular.module('io.kidsvideos.admin.main')
  .controller('ApprovedVideosController', ['VideoFactory', 'YoutubeVideoActivityFactory', '$scope', '$interval', '$state', '$stateParams',
    function (VideoFactory, YoutubeVideoActivityFactory, $scope, $interval, $state, $stateParams) {

      var
        messageInterval = null,
        msg0 = 'Loading results',
        msg1 = 'Still loading',
        msg2 = 'Takes longer than usual',
        msgErr = 'Error occured while loading search results'
        ;

      $scope.loadingMessage = '';
      $scope.results = null;

      $scope.max = $stateParams.max || '';
      $scope.offset = $stateParams.offset || '';

      $scope.$watch($stateParams, function () {
        searchForResults();
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

      function searchForResults() {
        startLoadingMessage();
        $scope.results = VideoFactory.approved.getAll({max : $scope.max, offset : $scope.offset}, null, function (responseData, responseHeaders) {
          stopMessageInterval();
        }, errorHandler);
      }

      $scope.next = function () {
        var params;
        if ($scope.results && $scope.results.links && $scope.results.links.next) {
          params = URI($scope.results.links.next).query(true);
          $state.go($state.$current.name, params);
        }
      };

      $scope.prev = function () {
        var params;
        if ($scope.results && $scope.results.links && $scope.results.links.prev) {
          params = URI($scope.results.links.prev).query(true);
          $state.go($state.$current.name, params);
        }
      };

      $scope.setApproved = function (itemIdx) {
        var item = $scope.results.items[itemIdx];
        YoutubeVideoActivityFactory.setActivityApproved(item, function (err, updatedItem) {
          if (err != null) {
            errorHandler(err);
          } else {
            item = updatedItem;
          }
        });
      };

      $scope.setSkipped = function (itemIdx) {
        var item = $scope.results.items[itemIdx];
        YoutubeVideoActivityFactory.setActivitySkipped(item, function (err, updatedItem) {
          if (err != null) {
            errorHandler(err);
          } else {
            item = updatedItem;
          }
        });
      };

      $scope.setPending = function (itemIdx) {
        var item = $scope.results.items[itemIdx];
        YoutubeVideoActivityFactory.setActivityPending(item, function (err, updatedItem) {
          if (err != null) {
            errorHandler(err);
          } else {
            item = updatedItem;
          }
        });
      };

      $scope.previewVideo = function (id) {
        $state.go('video.search.result', {id : id});
      };

      $scope.$on('$destroy', function () {
      });

    }]);
