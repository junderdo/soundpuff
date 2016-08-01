(function () {
  'use strict';

  angular
    .module('uploads')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('uploads', {
        abstract: true,
        url: '/uploads',
        template: '<ui-view/>'
      })
      .state('uploads.list', {
        url: '',
        templateUrl: 'modules/uploads/client/views/list-uploads.client.view.html',
        controller: 'UploadsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Uploads List'
        }
      })
      .state('uploads.create', {
        url: '/create',
        templateUrl: 'modules/uploads/client/views/form-upload.client.view.html',
        controller: 'UploadsController',
        controllerAs: 'vm',
        resolve: {
          uploadResolve: newUpload
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Uploads Create'
        }
      })
      .state('uploads.edit', {
        url: '/:uploadId/edit',
        templateUrl: 'modules/uploads/client/views/form-upload.client.view.html',
        controller: 'UploadsController',
        controllerAs: 'vm',
        resolve: {
          uploadResolve: getUpload
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Upload {{ uploadResolve.name }}'
        }
      })
      .state('uploads.view', {
        url: '/:uploadId',
        templateUrl: 'modules/uploads/client/views/view-upload.client.view.html',
        controller: 'UploadsController',
        controllerAs: 'vm',
        resolve: {
          uploadResolve: getUpload
        },
        data:{
          pageTitle: 'Upload {{ articleResolve.name }}'
        }
      });
  }

  getUpload.$inject = ['$stateParams', 'UploadsService'];

  function getUpload($stateParams, UploadsService) {
    return UploadsService.get({
      uploadId: $stateParams.uploadId
    }).$promise;
  }

  newUpload.$inject = ['UploadsService'];

  function newUpload(UploadsService) {
    return new UploadsService();
  }
})();
