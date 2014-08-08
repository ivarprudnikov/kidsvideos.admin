'use strict';

angular.module('admin.kidsvideos')
  .factory('PlaylistFactory', ['$resource', function ($resource) {

    return $resource('/api/client/playlist/:action/:id', {}, {
      list   : { method : 'GET', params : {action : 'list'} },
      show   : { method : 'GET', params : {action : 'show'} },
      save   : { method : 'POST', params : {action : 'save'} },
      update : { method : 'POST', params : {action : 'update', id : '@_id'} },
      delete : { method : 'POST', params : {action : 'delete', id : '@_id'} }
    });

  }]);
