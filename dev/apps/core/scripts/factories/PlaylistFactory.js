'use strict';

angular.module('admin.kidsvideos')
  .factory('PlaylistFactory', ['$resource','configuration', function ($resource,configuration) {

    return $resource( configuration.api.public.playlistPath + '/:action/:id', {}, {
      list   : { method : 'GET', params : {action : 'list'} },
      show   : { method : 'GET', params : {action : 'show'} },
      save   : { method : 'POST', params : {action : 'save'} },
      update : { method : 'POST', params : {action : 'update', id : '@_id'} },
      delete : { method : 'POST', params : {action : 'delete', id : '@_id'} }
    });

  }]);
