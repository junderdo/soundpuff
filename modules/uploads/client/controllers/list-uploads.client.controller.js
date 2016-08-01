(function () {
  'use strict';

  angular
    .module('uploads')
    .controller('UploadsListController', UploadsListController);

  UploadsListController.$inject = ['UploadsService'];

  function UploadsListController(UploadsService) {
    var vm = this;

    vm.uploads = UploadsService.query();
  }
})();
