//Uploads service used to communicate Uploads REST endpoints
(function () {
  'use strict';

  angular
    .module('uploads')
    .factory('UploadsService', UploadsService);

  UploadsService.$inject = ['$resource'];

  function UploadsService($resource) {
    return $resource('api/uploads/:uploadId', {
      uploadId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
