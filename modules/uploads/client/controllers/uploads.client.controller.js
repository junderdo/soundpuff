(function () {
  'use strict';

  // Uploads controller
  angular
    .module('uploads')
    .controller('UploadsController', UploadsController);

  UploadsController.$inject = ['$scope', '$state', 'Authentication', 'uploadResolve', 'FileUploader', '$timeout', '$window', '$rootScope'];

  function UploadsController ($scope, $state, Authentication, upload, FileUploader, $timeout, $window, $rootScope) {
    var vm = this;

    vm.authentication = Authentication;
    vm.upload = upload;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;


    function init() {
      // load the streamer if we're on a view state with an id
      if (vm.upload._id) {
		 // set it in the window
		 $window.audiostream = vm.upload;
		 // broadcast the message to footer controller where playback controls are
		 //$scope.$emit("audiostream-load", { stream: vm.upload });
		 $rootScope.$broadcast("audiostream-load", { stream: vm.upload });

      }
    }

    // Create file uploader instance
    $scope.uploader = new FileUploader({
      url: 'api/uploads/receive',
      alias: 'newSoundUpload'
    });

    // Set file uploader filter
    $scope.uploader.filters.push({
      name: 'soundFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|wav|mp3|'.indexOf(type) !== -1;
      }
    });

    // Called after the user selected a new sound file
    $scope.uploader.onAfterAddingFile = function (fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {

          }, 0);
        };
      }
    };

    // Called after the user has successfully uploaded a new sound
    $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
      // Show success message
      $scope.success = true;

      // Populate user object
      $scope.user = Authentication.user = response;

      // Clear upload buttons
      $scope.cancelUpload();
    };

    // Called after the user has failed to uploaded a new sound
    $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
      // Clear upload buttons
      $scope.cancelUpload();

      // Show error message
      $scope.error = response.message;
    };

    // Change user profile picture
    $scope.uploadSound = function () {
      // Clear messages
      $scope.success = $scope.error = null;

      // Start upload
      $scope.uploader.uploadAll();
    };

    // Cancel the upload process
    $scope.cancelUpload = function () {
      $scope.uploader.clearQueue();
    };

    $scope.saveSound = function () {
      save(true);
    };

    $scope.startPlayback = function () {
      vm.wavesurfer.play();
    };

    $scope.pausePlayback = function () {
      vm.wavesurfer.pause();
    };

    $scope.stopPlayback = function () {
      vm.wavesurfer.stop();
    };

    // Remove existing Upload
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.upload.$remove($state.go('uploads.list'));
      }
    }

    // Save Upload
    function save(isValid) {

      console.log('saving upload');

      if (!isValid) {
        console.log('not valid');
        $scope.$broadcast('show-errors-check-validity', 'vm.form.uploadForm');
        return false;
      }

      console.log('valid');

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

    init();
  }
})();
