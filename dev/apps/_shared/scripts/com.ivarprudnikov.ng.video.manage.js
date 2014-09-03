'use strict';

/* globals angular */

(function (angular) {

  var mod = angular.module(
  'com.ivarprudnikov.ng.video.manage', [
    'com.ivarprudnikov.ng.util', 'com.ivarprudnikov.ng.config', 'com.ivarprudnikov.ng.data', 'ui.bootstrap'
  ]
  );

  mod.factory(
  'ManageVideoService', [
    '$window', '$timeout', '$q', '$modal',
    function ($window, $timeout, $q, $modal) {

      function preparePromise(promise) {
        promise.success = function (fn) {
          promise.then(fn);
          return promise;
        };
        promise.error = function (fn) {
          promise.then(null, fn);
          return promise;
        };
      }

      var promise = null;

      return {

        addVideo : function (videoActivity) {

          if (promise) {
            return promise;
          }

          var deferred = $q.defer();
          promise = deferred.promise;

          preparePromise(promise);

          $modal.open(
          {
            templateUrl : 'views/addVideoToPlaylist.html',
            backdrop    : 'static',
            size        : 'md',
            keyboard    : true,
            controller  : 'AddVideoModalController',
            resolve     : {
              videoActivity : function () {
                return videoActivity;
              }
            }
          }
          ).result.then(
          function (videoAdded) {
            deferred.resolve(videoAdded);
          }, function (error) {
            deferred.reject(error);
          }
          ).catch(
          function (error) {
            deferred.reject(error);
          }
          ).finally(
          function () {
            promise = null;
          }
          );

          return promise;
        }

      };

    }
  ]
  );

  /**
   * View for the login modal
   */
  mod.run(
  [ '$templateCache', function ($templateCache) {
    $templateCache.put(
    'views/addVideoToPlaylist.html',
    '<div class="modal-header">\n' +
    ' <h3 class="modal-title">Add video</h3>\n' +
    '</div>\n' +
    '<div class="modal-body">\n' +
    ' <p ng-if="loadingMessage" class="text-warning">{{loadingMessage}}</p>' +
    ' <p ng-if="!loadingMessage">Title: {{video.displayName}}</p>' +
    ' <p ng-if="playlists.length">' +
    '  <select ng-model="selectedPlaylist" ng-options="p.title for p in playlists">' +
    '    <option value="">-- pick playlist --</option>' +
    '  </select>' +
    ' </p>' +
    ' <p ng-if="!loadingMessage && !playlists.length">You have no playlists</p>' +
    '</div>\n' +
    '<div class="modal-footer">\n' +
    ' <button type="button" class="btn btn-link" ng-click="cancelModal()">Cancel</button>' +
    ' <button type="button" class="btn btn-primary" ng-click="add()">Add</button>' +
    '</div>'
    );
  }]
  );

  mod.controller(
  'AddVideoModalController', [
    '$window', '$timeout', '$interval', '$scope', '$modalInstance', 'configuration', 'videoActivity',
    'YoutubeVideoActivityFactory', 'PlaylistFactory', 'Loader', '$q',
    function ($window, $timeout, $interval, $scope, $modalInstance, configuration, videoActivity,
              YoutubeVideoActivityFactory, PlaylistFactory, Loader, $q) {

      var loader = new Loader($scope, 'loadingMessage').start();

      $scope.selectedPlaylist = null;

      // cancel/close modal
      $scope.cancelModal = function () {
        loader.stop();
        $modalInstance.dismiss();
      };

      function loadVideo() {
        var deferred = $q.defer();
        if (videoActivity._id) {
          $timeout(function () {
            deferred.resolve(videoActivity);
          });
        } else {
          YoutubeVideoActivityFactory.setActivityPending(videoActivity, function (err, savedVideoActivity) {
            if (err) {
              deferred.reject(err);
            } else {
              deferred.resolve(savedVideoActivity);
            }
          });
        }
        return deferred.promise;
      }

      function loadPlaylists() {
        var deferred = $q.defer();
        PlaylistFactory.list({user:true}, null, function (responseData, responseHeaders) {
          deferred.resolve(responseData.items);
        }, function(err){
          deferred.reject(err);
        });
        return deferred.promise;
      }

      $q.all({
               video     : loadVideo(),
               playlists : loadPlaylists()
             }).then(function(results){

        $scope.video = results.video;
        $scope.playlists = results.playlists;

        loader.stop();
      });




      // create new playlist

      // add video to existing playlist

      $scope.add = function(){

      }

    }
  ]
  );

}(angular));

