'use strict';

/* globals angular */

(function (angular) {

  var mod = angular.module('com.ivarprudnikov.ng.data', [
    'com.ivarprudnikov.ng.config', 'ui.bootstrap'
  ]);

  mod.factory('PlaylistFactory', ['$resource', 'configuration', function ($resource, configuration) {

    return $resource(configuration.api.admin.playlist + '/:id', {}, {
      list : { method : 'GET' },
      show : { method : 'GET', params : {id : '@_id'} },
      save : { method : 'POST' },
      update : { method : 'PUT', params : {id : '@_id'} },
      delete : { method : 'DELETE', params : {id : '@_id'} }
    });

  }]);

  mod.factory('PlaylistVideoFactory', ['$resource', 'configuration', function ($resource, configuration) {

    return $resource(configuration.api.admin.playlist + '/:playlistId/video/:id', {}, {
      save : { method : 'POST' },
      delete : { method : 'DELETE', params : {id : '@_id'} }
    });

  }]);

  mod.factory('StatisticsFactory', ['$resource', 'configuration', function ($resource, configuration) {

    return $resource(configuration.api.admin.stats, {}, {
      getAll : { method : 'GET', cache : false }
    });

  }]);

  mod.factory('VideoFactory', ['$resource', 'configuration', function ($resource, configuration) {

    return {

      item : $resource(configuration.api.admin.video + '/:action/:provider/:id', {}, {
        setApproved : { method : 'POST', params : {action : 'approved'} },
        setSkipped : { method : 'POST', params : {action : 'skipped'} },
        setPending : { method : 'POST', params : {action : 'pending'} }
      }),

      search : $resource(configuration.api.admin.search, {}, {
        getAll : { method : 'GET', cache : false }
      })

    };

  }]);

  mod.factory('YoutubeVideoActivityFactory', ['VideoFactory', '$timeout', function (VideoFactory, $timeout) {

    /* jshint eqeqeq:false,eqnull:true */

    return {

      setActivitySkipped : function (videoActivityObj, cb) {

        var item = videoActivityObj || {}, params = { id : item.id, provider : 'youtube'}, img = item.image && item.image.length ? item.image[item.image.length - 1].url : null, postBody = { title : item.displayName }, props = ['_id','isApproved', 'isSkipped', 'isPending'];

        if (item == null) {
          return cb('Video object is missing');
        }

        if (img != null) {
          postBody.imageUrl = img;
        }

        VideoFactory.item.setSkipped(params, postBody, function (responseData, responseHeaders) {
          $timeout(function () {

            for (var i = 0; i < props.length; i++) {
              item[props[i]] = responseData[props[i]];
            }

            cb(null, item);

          });
        }, function (httpResponse) {
          cb('Server error');
        });

      },

      setActivityApproved : function (videoActivityObj, cb) {

        var item = videoActivityObj || {}, params = { id : item.id, provider : 'youtube'}, img = item.image && item.image.length ? item.image[item.image.length - 1].url : null, postBody = { title : item.displayName }, props = ['_id','isApproved', 'isSkipped', 'isPending'];

        if (item == null) {
          return cb('Video object is missing');
        }

        if (img != null) {
          postBody.imageUrl = img;
        }

        VideoFactory.item.setApproved(params, postBody, function (responseData, responseHeaders) {
          $timeout(function () {

            for (var i = 0; i < props.length; i++) {
              item[props[i]] = responseData[props[i]];
            }

            cb(null, item);

          });
        }, function (httpResponse) {
          cb('Server error');
        });

      },

      setActivityPending : function (videoActivityObj, cb) {

        var item = videoActivityObj || {}, params = { id : item.id, provider : 'youtube'}, img = item.image && item.image.length ? item.image[item.image.length - 1].url : null, postBody = { title : item.displayName }, props = ['_id','isApproved', 'isSkipped', 'isPending'];

        if (item == null) {
          return cb('Video object is missing');
        }

        if (img != null) {
          postBody.imageUrl = img;
        }

        VideoFactory.item.setPending(params, postBody, function (responseData, responseHeaders) {
          $timeout(function () {
            for (var i = 0; i < props.length; i++) {
              item[props[i]] = responseData[props[i]];
            }
            cb(null, item);
          });
        }, function (httpResponse) {
          cb('Server error');
        });

      }
    };

  }]);



}(angular));

