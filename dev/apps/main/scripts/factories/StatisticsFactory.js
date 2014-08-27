'use strict';

angular.module('io.kidsvideos.admin.main').factory('StatisticsFactory', ['$resource', 'configuration', function ($resource, configuration) {

  return $resource(configuration.api.private.stats, {}, {
    getAll : { method : 'GET', cache : false }
  });

}]);
