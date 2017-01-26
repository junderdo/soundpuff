'use strict';

angular.module('core').controller('FooterController', ['$window', '$scope', '$state', 'PlaybackControls',
  function ($window, $scope, $state, PlaybackControls) {
	  var vm = this;

      $scope.playbackButtonClass = 'glyphicon-play';
	  // when ths user leaves the view we'll stop playback for now
	  // until we come up with a global playback toolbar (on the bottom of app layout)
	  $scope.$on('$destroy', function() {
		$scope.stopPlayback();
	  });

	  $scope.$on('audiostream-load', function() {
		  $scope.loadAudioStream();
	  });

	  $scope.togglePlayback = function () {
          if (vm.wavesurfer.isPlaying()) {
              // pause playback
              vm.wavesurfer.pause();
              $scope.playbackButtonClass = 'glyphicon-play';
          } else {
              // start/resume playback
              vm.wavesurfer.play();
              $scope.playbackButtonClass = 'glyphicon-pause';
          }
	  };

	  $scope.stopPlayback = function () {
		vm.wavesurfer.stop();
        $scope.playbackButtonClass = 'glyphicon-play';
	  };

	 $scope.loadAudioStream = function(){

         // if and old stream exists then destroy it first
         if (vm.wavesurfer) {
             $scope.playbackButtonClass = 'glyphicon-play';
             vm.wavesurfer.destroy();
         }

		var audiostream = $window.audiostream;
        vm.audiostream = audiostream

	   // footer controller code here
	   // show the loading icon until the stream loads
	   $scope.hideLoadingIcon = false;
	   $scope.loadingPercent = '0%';

       $scope.streamName = '';

	   // init the wavesurfer streaming interface
	   var wavesurfer = $window.WaveSurfer.create({
		 container: '#audiostream-footer',
		 waveColor: 'dodgerblue',
		 progressColor: 'slateblue',
		 barWidth: 2,
		 cursorWidth: 0 // hide the cursor
	   });

	   // attempt to load the stream
	   wavesurfer.load(audiostream.filePath);

	   wavesurfer.on('loading', function(percent) {
		 $scope.$apply(function() {
		   if (percent < 100) {
			 $scope.loadingPercent = percent + '%';
		   } else {
			 $scope.loadingPercent = 'processing audio...';
		   }
		 });
	   });

	   wavesurfer.on('ready', function () {
		 // auto-start?
		 // wavesurfer.play();
		 // apply the hideLoadingIcon value of false such that it is re-rendered and hidden
		 $scope.$apply(function() {
		   $scope.hideLoadingIcon = true;
           $scope.streamName = vm.audiostream.name + ' - uploaded by ' + vm.audiostream.user.displayName;
		 });
	   });

	   // attach the wavesurfer to the controller for later usage
	   vm.wavesurfer = wavesurfer;
   	};
  }
]);
