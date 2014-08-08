'use strict';

angular.module('admin.kidsvideos')
  .controller('VideoPreviewController', ['$scope', '$rootScope', '$timeout', '$interval', '$state', '$stateParams',
    function ($scope, $rootScope, $timeout, $interval, $state, $stateParams) {

      $scope.id = $stateParams.id || '';

      /*

       // TODO handle prev/next video navigation

       $scope.loadNextId = function(currentId){
       return currentId + '0000000';
       };
       $scope.loadPreviousId = function(currentId){
       return '0000000' + currentId;
       };
       */

      $scope.$on('$destroy', function () {
      });

    }]);
