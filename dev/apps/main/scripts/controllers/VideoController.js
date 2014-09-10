'use strict';

angular.module('io.kidsvideos.admin.main')
.controller(
'VideoController',
[
  'ManageVideoService', 'VideoFactory', 'YoutubeVideoActivityFactory', '$scope', '$interval', '$state', '$stateParams',
  function (ManageVideoService, VideoFactory, YoutubeVideoActivityFactory, $scope, $interval, $state, $stateParams) {

    var messageInterval = null,
        msg0 = 'Loading search results',
        msg1 = 'Still loading',
        msg2 = 'Takes longer than usual',
        msgErr = 'Error occured while loading search results';

    $scope.q = $stateParams.q || '';
    $scope.t = $stateParams.t || '';

    $scope.loadingMessage = '';
    $scope.results = null;

    $scope.$watch(
    $stateParams, function () {
      searchForResults();
    }
    );

    function stopMessageInterval() {
      if (angular.isDefined(messageInterval)) {
        $scope.loadingMessage = '';
        $interval.cancel(messageInterval);
      }
    }

    function startLoadingMessage() {
      $scope.loadingMessage = msg0;
      messageInterval = $interval(
      function () {
        if ($scope.loadingMessage === msg0) {
          $scope.loadingMessage = msg1;
        } else if ($scope.loadingMessage === msg1) {
          $scope.loadingMessage = msg2;
        } else {
          $scope.loadingMessage += '.';
        }
      }, 7000
      );
    }

    function errorHandler(httpResponse) {
      stopMessageInterval();
      $scope.loadingMessage = msgErr;
    }

    function searchForResults() {
      if (!$scope.q) {
        console.log('no query');
      } else {
        startLoadingMessage();
        $scope.results = VideoFactory.search.getAll(
        {query : $scope.q, token : $scope.t}, null, function (responseData, responseHeaders) {
          stopMessageInterval();
        }, errorHandler
        );
      }
    }

    $scope.search = function () {
      $state.go($state.$current.name, {q : $scope.q});
    };

    $scope.next = function () {
      var arr, token, params;
      if ($scope.results && $scope.results.links && $scope.results.links.next) {

        arr = $scope.results.links.next.split('/');
        token = arr[arr.length - 1];
        params = {q : $scope.q};
        if (token) {
          params.t = token;
        }

        $state.go($state.$current.name, params);

      }
    };

    $scope.prev = function () {
      var arr, token, params;
      if ($scope.results && $scope.results.links && $scope.results.links.prev) {

        arr = $scope.results.links.prev.split('/');
        token = arr[arr.length - 1];
        params = {q : $scope.q};
        if (token) {
          params.t = token;
        }

        $state.go($state.$current.name, params);
      }
    };

    $scope.setApproved = function (itemIdx) {

      /* jshint eqeqeq:false,eqnull:true */

      var item = $scope.results.items[itemIdx];
      YoutubeVideoActivityFactory.setActivityApproved(
      item, function (err, updatedItem) {
        if (err != null) {
          errorHandler(err);
        } else {
          item = updatedItem;
        }
      }
      );
    };

    $scope.setSkipped = function (itemIdx) {

      /* jshint eqeqeq:false,eqnull:true */

      var item = $scope.results.items[itemIdx];
      YoutubeVideoActivityFactory.setActivitySkipped(
      item, function (err, updatedItem) {
        if (err != null) {
          errorHandler(err);
        } else {
          item = updatedItem;
        }
      }
      );
    };

    $scope.setPending = function (itemIdx) {

      /* jshint eqeqeq:false,eqnull:true */

      var item = $scope.results.items[itemIdx];
      YoutubeVideoActivityFactory.setActivityPending(
      item, function (err, updatedItem) {
        if (err != null) {
          errorHandler(err);
        } else {
          item = updatedItem;
        }
      }
      );
    };

    $scope.previewVideo = function (id) {
      $state.go('video.search.result', {id : id});
    };

    $scope.addTo = function (itemIdx) {
      var item = $scope.results.items[itemIdx];
      ManageVideoService.addVideo(item);
    };

    $scope.$on(
    '$destroy', function () {
    }
    );

  }
]
);
