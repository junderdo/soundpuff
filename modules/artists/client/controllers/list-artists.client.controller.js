(function () {
  'use strict';

  angular
    .module('artists')
    .controller('ArtistsListController', ArtistsListController);

  ArtistsListController.$inject = ['ArtistsService'];

  function ArtistsListController(ArtistsService) {
    var vm = this;

    vm.artists = ArtistsService.query();
  }
})();
