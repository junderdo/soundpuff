(function () {
  'use strict';

  describe('Uploads Route Tests', function () {
    // Initialize global variables
    var $scope,
      UploadsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _UploadsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      UploadsService = _UploadsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('uploads');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/uploads');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          UploadsController,
          mockUpload;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('uploads.view');
          $templateCache.put('modules/uploads/client/views/view-upload.client.view.html', '');

          // create mock Upload
          mockUpload = new UploadsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Upload Name'
          });

          //Initialize Controller
          UploadsController = $controller('UploadsController as vm', {
            $scope: $scope,
            uploadResolve: mockUpload
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:uploadId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.uploadResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            uploadId: 1
          })).toEqual('/uploads/1');
        }));

        it('should attach an Upload to the controller scope', function () {
          expect($scope.vm.upload._id).toBe(mockUpload._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/uploads/client/views/view-upload.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          UploadsController,
          mockUpload;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('uploads.create');
          $templateCache.put('modules/uploads/client/views/form-upload.client.view.html', '');

          // create mock Upload
          mockUpload = new UploadsService();

          //Initialize Controller
          UploadsController = $controller('UploadsController as vm', {
            $scope: $scope,
            uploadResolve: mockUpload
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.uploadResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/uploads/create');
        }));

        it('should attach an Upload to the controller scope', function () {
          expect($scope.vm.upload._id).toBe(mockUpload._id);
          expect($scope.vm.upload._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/uploads/client/views/form-upload.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          UploadsController,
          mockUpload;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('uploads.edit');
          $templateCache.put('modules/uploads/client/views/form-upload.client.view.html', '');

          // create mock Upload
          mockUpload = new UploadsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Upload Name'
          });

          //Initialize Controller
          UploadsController = $controller('UploadsController as vm', {
            $scope: $scope,
            uploadResolve: mockUpload
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:uploadId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.uploadResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            uploadId: 1
          })).toEqual('/uploads/1/edit');
        }));

        it('should attach an Upload to the controller scope', function () {
          expect($scope.vm.upload._id).toBe(mockUpload._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/uploads/client/views/form-upload.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
