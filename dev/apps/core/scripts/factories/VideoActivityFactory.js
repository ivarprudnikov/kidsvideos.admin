'use strict';

/* jshint eqeqeq:false,eqnull:true */

angular.module('admin.kidsvideos')
  .factory('YoutubeVideoActivityFactory', ['VideoFactory', '$timeout', function (VideoFactory, $timeout) {

    return {

      setActivitySkipped : function (videoActivityObj, cb) {

        var item = videoActivityObj || {},
          params = { id : item.id, provider : 'youtube'},
          img = item.image && item.image.length ? item.image[item.image.length - 1].url : null,
          postBody = { title : item.displayName },
          props = ['isApproved', 'isSkipped', 'isPending']
          ;

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

        var item = videoActivityObj || {},
          params = { id : item.id, provider : 'youtube'},
          img = item.image && item.image.length ? item.image[item.image.length - 1].url : null,
          postBody = { title : item.displayName },
          props = ['isApproved', 'isSkipped', 'isPending']
          ;

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

        var item = videoActivityObj || {},
          params = { id : item.id, provider : 'youtube'},
          img = item.image && item.image.length ? item.image[item.image.length - 1].url : null,
          postBody = { title : item.displayName },
          props = ['isApproved', 'isSkipped', 'isPending']
          ;

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