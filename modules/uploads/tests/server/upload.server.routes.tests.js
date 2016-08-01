'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Upload = mongoose.model('Upload'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, upload;

/**
 * Upload routes tests
 */
describe('Upload CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Upload
    user.save(function () {
      upload = {
        name: 'Upload name'
      };

      done();
    });
  });

  it('should be able to save a Upload if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Upload
        agent.post('/api/uploads')
          .send(upload)
          .expect(200)
          .end(function (uploadSaveErr, uploadSaveRes) {
            // Handle Upload save error
            if (uploadSaveErr) {
              return done(uploadSaveErr);
            }

            // Get a list of Uploads
            agent.get('/api/uploads')
              .end(function (uploadsGetErr, uploadsGetRes) {
                // Handle Upload save error
                if (uploadsGetErr) {
                  return done(uploadsGetErr);
                }

                // Get Uploads list
                var uploads = uploadsGetRes.body;

                // Set assertions
                (uploads[0].user._id).should.equal(userId);
                (uploads[0].name).should.match('Upload name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Upload if not logged in', function (done) {
    agent.post('/api/uploads')
      .send(upload)
      .expect(403)
      .end(function (uploadSaveErr, uploadSaveRes) {
        // Call the assertion callback
        done(uploadSaveErr);
      });
  });

  it('should not be able to save an Upload if no name is provided', function (done) {
    // Invalidate name field
    upload.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Upload
        agent.post('/api/uploads')
          .send(upload)
          .expect(400)
          .end(function (uploadSaveErr, uploadSaveRes) {
            // Set message assertion
            (uploadSaveRes.body.message).should.match('Please fill Upload name');

            // Handle Upload save error
            done(uploadSaveErr);
          });
      });
  });

  it('should be able to update an Upload if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Upload
        agent.post('/api/uploads')
          .send(upload)
          .expect(200)
          .end(function (uploadSaveErr, uploadSaveRes) {
            // Handle Upload save error
            if (uploadSaveErr) {
              return done(uploadSaveErr);
            }

            // Update Upload name
            upload.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Upload
            agent.put('/api/uploads/' + uploadSaveRes.body._id)
              .send(upload)
              .expect(200)
              .end(function (uploadUpdateErr, uploadUpdateRes) {
                // Handle Upload update error
                if (uploadUpdateErr) {
                  return done(uploadUpdateErr);
                }

                // Set assertions
                (uploadUpdateRes.body._id).should.equal(uploadSaveRes.body._id);
                (uploadUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Uploads if not signed in', function (done) {
    // Create new Upload model instance
    var uploadObj = new Upload(upload);

    // Save the upload
    uploadObj.save(function () {
      // Request Uploads
      request(app).get('/api/uploads')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Upload if not signed in', function (done) {
    // Create new Upload model instance
    var uploadObj = new Upload(upload);

    // Save the Upload
    uploadObj.save(function () {
      request(app).get('/api/uploads/' + uploadObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', upload.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Upload with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/uploads/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Upload is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Upload which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Upload
    request(app).get('/api/uploads/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Upload with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Upload if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Upload
        agent.post('/api/uploads')
          .send(upload)
          .expect(200)
          .end(function (uploadSaveErr, uploadSaveRes) {
            // Handle Upload save error
            if (uploadSaveErr) {
              return done(uploadSaveErr);
            }

            // Delete an existing Upload
            agent.delete('/api/uploads/' + uploadSaveRes.body._id)
              .send(upload)
              .expect(200)
              .end(function (uploadDeleteErr, uploadDeleteRes) {
                // Handle upload error error
                if (uploadDeleteErr) {
                  return done(uploadDeleteErr);
                }

                // Set assertions
                (uploadDeleteRes.body._id).should.equal(uploadSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Upload if not signed in', function (done) {
    // Set Upload user
    upload.user = user;

    // Create new Upload model instance
    var uploadObj = new Upload(upload);

    // Save the Upload
    uploadObj.save(function () {
      // Try deleting Upload
      request(app).delete('/api/uploads/' + uploadObj._id)
        .expect(403)
        .end(function (uploadDeleteErr, uploadDeleteRes) {
          // Set message assertion
          (uploadDeleteRes.body.message).should.match('User is not authorized');

          // Handle Upload error error
          done(uploadDeleteErr);
        });

    });
  });

  it('should be able to get a single Upload that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Upload
          agent.post('/api/uploads')
            .send(upload)
            .expect(200)
            .end(function (uploadSaveErr, uploadSaveRes) {
              // Handle Upload save error
              if (uploadSaveErr) {
                return done(uploadSaveErr);
              }

              // Set assertions on new Upload
              (uploadSaveRes.body.name).should.equal(upload.name);
              should.exist(uploadSaveRes.body.user);
              should.equal(uploadSaveRes.body.user._id, orphanId);

              // force the Upload to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Upload
                    agent.get('/api/uploads/' + uploadSaveRes.body._id)
                      .expect(200)
                      .end(function (uploadInfoErr, uploadInfoRes) {
                        // Handle Upload error
                        if (uploadInfoErr) {
                          return done(uploadInfoErr);
                        }

                        // Set assertions
                        (uploadInfoRes.body._id).should.equal(uploadSaveRes.body._id);
                        (uploadInfoRes.body.name).should.equal(upload.name);
                        should.equal(uploadInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Upload.remove().exec(done);
    });
  });
});
