//Artists service used to communicate Artists REST endpoints
(function () {
  'use strict';

  angular
    .module('artists')
    .factory('ArtistsService', ArtistsService);

  ArtistsService.$inject = ['$resource'];

  function ArtistsService($resource) {
    return $resource('api/artists/:artistId', {
      artistId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
