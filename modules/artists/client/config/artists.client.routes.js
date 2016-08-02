(function () {
  'use strict';

  angular
    .module('artists')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('artists', {
        abstract: true,
        url: '/artists',
        template: '<ui-view/>'
      })
      .state('artists.list', {
        url: '',
        templateUrl: 'modules/artists/client/views/list-artists.client.view.html',
        controller: 'ArtistsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Artists List'
        }
      })
      .state('artists.create', {
        url: '/create',
        templateUrl: 'modules/artists/client/views/form-artist.client.view.html',
        controller: 'ArtistsController',
        controllerAs: 'vm',
        resolve: {
          artistResolve: newArtist
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Artists Create'
        }
      })
      .state('artists.edit', {
        url: '/:artistId/edit',
        templateUrl: 'modules/artists/client/views/form-artist.client.view.html',
        controller: 'ArtistsController',
        controllerAs: 'vm',
        resolve: {
          artistResolve: getArtist
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Artist {{ artistResolve.name }}'
        }
      })
      .state('artists.view', {
        url: '/:artistId',
        templateUrl: 'modules/artists/client/views/view-artist.client.view.html',
        controller: 'ArtistsController',
        controllerAs: 'vm',
        resolve: {
          artistResolve: getArtist
        },
        data:{
          pageTitle: 'Artist {{ articleResolve.name }}'
        }
      });
  }

  getArtist.$inject = ['$stateParams', 'ArtistsService'];

  function getArtist($stateParams, ArtistsService) {
    return ArtistsService.get({
      artistId: $stateParams.artistId
    }).$promise;
  }

  newArtist.$inject = ['ArtistsService'];

  function newArtist(ArtistsService) {
    return new ArtistsService();
  }
})();
