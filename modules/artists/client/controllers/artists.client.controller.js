(function () {
  'use strict';

  // Artists controller
  angular
    .module('artists')
    .controller('ArtistsController', ArtistsController);

  ArtistsController.$inject = ['$scope', '$state', 'Authentication', 'artistResolve'];

  function ArtistsController ($scope, $state, Authentication, artist) {
    var vm = this;

    vm.authentication = Authentication;
    vm.artist = artist;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Artist
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.artist.$remove($state.go('artists.list'));
      }
    }

    // Save Artist
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.artistForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.artist._id) {
        vm.artist.$update(successCallback, errorCallback);
      } else {
        vm.artist.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('artists.view', {
          artistId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
