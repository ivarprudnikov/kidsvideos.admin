'use strict';

/* jshint eqeqeq:false,eqnull:true */

angular.module('admin.kidsvideos')
  .controller('PlaylistListController', ['$scope', '$state', '$stateParams', '$interval', 'PlaylistFactory',
    function ($scope, $state, $stateParams, $interval, PlaylistFactory) {

      var messageInterval = null,
        msg0 = 'Loading results',
        msg1 = 'Still loading',
        msg2 = 'Takes longer than usual',
        msgErr = 'Error occured while loading search results';

      $scope.availableSorts = [
        { name : 'Date created', value : 'dateCreated' },
        { name : 'Last updated', value : 'lastUpdated' },
        { name : 'Title', value : 'title' },
        { name : 'Is public', value : 'isPublic' }
      ];

      $scope.availableOrders = [
        { name : 'Ascending', value : 'asc' },
        { name : 'Descending', value : 'desc' }
      ];

      $scope.availablePublicStates = [
        { name : 'Is public', value : true },
        { name : 'Not public', value : false }
      ];

      $scope.availableApprovedStates = [
        { name : 'Is approved', value : true },
        { name : 'Not approved', value : false }
      ];

      $scope.availableSkippedStates = [
        { name : 'Is skipped', value : true },
        { name : 'Not skipped', value : false }
      ];

      $scope.availablePendingStates = [
        { name : 'Is pending', value : true },
        { name : 'Not pending', value : false }
      ];

      $scope.searchOptions = {
        query      : $stateParams.query || '',
        max        : Math.min((parseInt($stateParams.max) || 10), 100),
        offset     : parseInt($stateParams.offset) || 0,
        sort       : $stateParams.sort || 'dateCreated',
        order      : $stateParams.order === 'asc' ? 'asc' : 'desc',
        isPublic   : ($stateParams.isPublic != null ? $stateParams.isPublic === 'true' : null),
        isApproved : ($stateParams.isApproved != null ? $stateParams.isApproved === 'true' : null),
        isSkipped  : ($stateParams.isSkipped != null ? $stateParams.isSkipped === 'true' : null),
        isPending  : ($stateParams.isPending != null ? $stateParams.isPending === 'true' : null),
        user       : $stateParams.user === 'true'
      };

      $scope.loadingMessage = '';
      $scope.results = null;

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

      // select fields that are not null/undefined only
      function selectedSearchOptions() {
        return _.reduce($scope.searchOptions, function (memo, v, k) {
          if (v != null) {
            memo[k] = v;
          }
          return memo;
        }, {});
      }

      function searchForResults() {
        startLoadingMessage();

        $scope.results = PlaylistFactory.list(selectedSearchOptions(), null, function (responseData, responseHeaders) {
          stopMessageInterval();
        }, errorHandler);
      }

      $scope.search = function () {
        $state.go($state.$current.name, selectedSearchOptions(), {inherit : false});
      };

      $scope.$on('$destroy', function () {
      });

    }]);
