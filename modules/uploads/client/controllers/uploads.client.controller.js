(function () {
  'use strict';

  // Uploads controller
  angular
    .module('uploads')
    .controller('UploadsController', UploadsController);

  UploadsController.$inject = ['$scope', '$state', 'Authentication', 'uploadResolve'];

  function UploadsController ($scope, $state, Authentication, upload) {
    var vm = this;

    vm.authentication = Authentication;
    vm.upload = upload;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Upload
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.upload.$remove($state.go('uploads.list'));
      }
    }

    // Save Upload
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.uploadForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.upload._id) {
        vm.upload.$update(successCallback, errorCallback);
      } else {
        vm.upload.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('uploads.view', {
          uploadId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
