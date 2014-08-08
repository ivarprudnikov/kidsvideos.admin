'use strict';

angular.module('admin.kidsvideos')
  .factory('VideoFactory', ['$resource', function ($resource) {

    return {

      item : $resource('/admin/video/:action/:provider/:id', {}, {
        setApproved : { method : 'POST', params : {action : 'approved'} },
        setSkipped  : { method : 'POST', params : {action : 'skipped'} },
        setPending  : { method : 'POST', params : {action : 'pending'} }
      }),

      search : $resource('/admin/search/video/:query/:token', {}, {
        getAll : { method : 'GET', cache : false }
      }),

      skipped : $resource('/api/client/video/skipped', {}, {
        getAll : { method : 'GET', cache : false }
      }),

      pending : $resource('/api/client/video/pending', {}, {
        getAll : { method : 'GET', cache : false }
      }),

      approved : $resource('/api/client/video/approved', {}, {
        getAll : { method : 'GET', cache : false }
      })

    };

  }]);
