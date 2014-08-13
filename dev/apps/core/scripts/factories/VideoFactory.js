'use strict';

angular.module('admin.kidsvideos')
  .factory('VideoFactory', ['$resource','configuration', function ($resource,configuration) {

    return {

      item : $resource( configuration.api.private.videoShow + '/:action/:provider/:id', {}, {
        setApproved : { method : 'POST', params : {action : 'approved'} },
        setSkipped  : { method : 'POST', params : {action : 'skipped'} },
        setPending  : { method : 'POST', params : {action : 'pending'} }
      }),

      search : $resource( configuration.api.private.videoSearch + '/:query/:token', {}, {
        getAll : { method : 'GET', cache : false }
      }),

      skipped : $resource( configuration.api.public.videoSkipped, {}, {
        getAll : { method : 'GET', cache : false }
      }),

      pending : $resource( configuration.api.public.videoPending, {}, {
        getAll : { method : 'GET', cache : false }
      }),

      approved : $resource( configuration.api.public.videoApproved, {}, {
        getAll : { method : 'GET', cache : false }
      })

    };

  }]);
