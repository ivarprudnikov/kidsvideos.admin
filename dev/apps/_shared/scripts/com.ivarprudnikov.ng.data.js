'use strict';

/* globals angular */

(function (angular) {

  var mod = angular.module('com.ivarprudnikov.ng.data', [
    'com.ivarprudnikov.ng.config', 'ui.bootstrap'
  ]);

  mod.factory('PlaylistFactory', ['$resource', 'configuration', function ($resource, configuration) {

    return $resource(configuration.api.public.playlistPath + '/:action/:id', {}, {
      list : { method : 'GET', params : {action : 'list'} },
      show : { method : 'GET', params : {action : 'show'} },
      save : { method : 'POST', params : {action : 'save'} },
      update : { method : 'POST', params : {action : 'update', id : '@_id'} },
      delete : { method : 'POST', params : {action : 'delete', id : '@_id'} },
      addVideo : { method : 'POST', params : {action : 'addVideo'} }
    });

  }]);

  mod.factory('StatisticsFactory', ['$resource', 'configuration', function ($resource, configuration) {

    return $resource(configuration.api.private.stats, {}, {
      getAll : { method : 'GET', cache : false }
    });

  }]);

  mod.factory('VideoFactory', ['$resource', 'configuration', function ($resource, configuration) {

    return {

      item : $resource(configuration.api.private.videoShow + '/:action/:provider/:id', {}, {
        setApproved : { method : 'POST', params : {action : 'approved'} },
        setSkipped : { method : 'POST', params : {action : 'skipped'} },
        setPending : { method : 'POST', params : {action : 'pending'} }
      }),

      search : $resource(configuration.api.private.videoSearch + '/:query/:token', {}, {
        getAll : { method : 'GET', cache : false }
      }),

      skipped : $resource(configuration.api.public.videoSkipped, {}, {
        getAll : { method : 'GET', cache : false }
      }),

      pending : $resource(configuration.api.public.videoPending, {}, {
        getAll : { method : 'GET', cache : false }
      }),

      approved : $resource(configuration.api.public.videoApproved, {}, {
        getAll : { method : 'GET', cache : false }
      })

    };

  }]);

  mod.factory('YoutubeVideoActivityFactory', ['VideoFactory', '$timeout', function (VideoFactory, $timeout) {

    return {

      setActivitySkipped : function (videoActivityObj, cb) {

        var item = videoActivityObj || {}, params = { id : item.id, provider : 'youtube'}, img = item.image && item.image.length ? item.image[item.image.length - 1].url : null, postBody = { title : item.displayName }, props = ['isApproved', 'isSkipped', 'isPending'];

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

        var item = videoActivityObj || {}, params = { id : item.id, provider : 'youtube'}, img = item.image && item.image.length ? item.image[item.image.length - 1].url : null, postBody = { title : item.displayName }, props = ['isApproved', 'isSkipped', 'isPending'];

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

        var item = videoActivityObj || {}, params = { id : item.id, provider : 'youtube'}, img = item.image && item.image.length ? item.image[item.image.length - 1].url : null, postBody = { title : item.displayName }, props = ['isApproved', 'isSkipped', 'isPending'];

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

