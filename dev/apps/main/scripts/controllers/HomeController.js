'use strict';

angular.module('io.kidsvideos.admin.main')
  .controller(
  'HomeController', [
    '$scope', '$rootScope', '$timeout', 'StatisticsFactory',
    function ($scope, $rootScope, $timeout, StatisticsFactory) {

      StatisticsFactory.getAll({}, function (responseData, responseHeaders) {
        var fields = ['videosApproved',
                      'videosSkipped',
                      'videosPending',
                      'videosTotal',
                      'playlistsApproved',
                      'playlistsSkipped',
                      'playlistsPending',
                      'playlistsPublic',
                      'playlistsTotal'];


           angular.forEach(fields,function(f){
             $scope[f] = responseData.data[f];
           });

         }, function (httpResponse) {
           console.log('err', httpResponse);
         }
      );

      $scope.$on(
        '$destroy', function () {
        }
      );

    }
  ]
);
