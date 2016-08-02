'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Artist = mongoose.model('Artist'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, artist;

/**
 * Artist routes tests
 */
describe('Artist CRUD tests', function () {

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

    // Save a user to the test db and create new Artist
    user.save(function () {
      artist = {
        name: 'Artist name'
      };

      done();
    });
  });

  it('should be able to save a Artist if logged in', function (done) {
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

        // Save a new Artist
        agent.post('/api/artists')
          .send(artist)
          .expect(200)
          .end(function (artistSaveErr, artistSaveRes) {
            // Handle Artist save error
            if (artistSaveErr) {
              return done(artistSaveErr);
            }

            // Get a list of Artists
            agent.get('/api/artists')
              .end(function (artistsGetErr, artistsGetRes) {
                // Handle Artist save error
                if (artistsGetErr) {
                  return done(artistsGetErr);
                }

                // Get Artists list
                var artists = artistsGetRes.body;

                // Set assertions
                (artists[0].user._id).should.equal(userId);
                (artists[0].name).should.match('Artist name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Artist if not logged in', function (done) {
    agent.post('/api/artists')
      .send(artist)
      .expect(403)
      .end(function (artistSaveErr, artistSaveRes) {
        // Call the assertion callback
        done(artistSaveErr);
      });
  });

  it('should not be able to save an Artist if no name is provided', function (done) {
    // Invalidate name field
    artist.name = '';

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

        // Save a new Artist
        agent.post('/api/artists')
          .send(artist)
          .expect(400)
          .end(function (artistSaveErr, artistSaveRes) {
            // Set message assertion
            (artistSaveRes.body.message).should.match('Please fill Artist name');

            // Handle Artist save error
            done(artistSaveErr);
          });
      });
  });

  it('should be able to update an Artist if signed in', function (done) {
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

        // Save a new Artist
        agent.post('/api/artists')
          .send(artist)
          .expect(200)
          .end(function (artistSaveErr, artistSaveRes) {
            // Handle Artist save error
            if (artistSaveErr) {
              return done(artistSaveErr);
            }

            // Update Artist name
            artist.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Artist
            agent.put('/api/artists/' + artistSaveRes.body._id)
              .send(artist)
              .expect(200)
              .end(function (artistUpdateErr, artistUpdateRes) {
                // Handle Artist update error
                if (artistUpdateErr) {
                  return done(artistUpdateErr);
                }

                // Set assertions
                (artistUpdateRes.body._id).should.equal(artistSaveRes.body._id);
                (artistUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Artists if not signed in', function (done) {
    // Create new Artist model instance
    var artistObj = new Artist(artist);

    // Save the artist
    artistObj.save(function () {
      // Request Artists
      request(app).get('/api/artists')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Artist if not signed in', function (done) {
    // Create new Artist model instance
    var artistObj = new Artist(artist);

    // Save the Artist
    artistObj.save(function () {
      request(app).get('/api/artists/' + artistObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', artist.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Artist with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/artists/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Artist is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Artist which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Artist
    request(app).get('/api/artists/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Artist with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Artist if signed in', function (done) {
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

        // Save a new Artist
        agent.post('/api/artists')
          .send(artist)
          .expect(200)
          .end(function (artistSaveErr, artistSaveRes) {
            // Handle Artist save error
            if (artistSaveErr) {
              return done(artistSaveErr);
            }

            // Delete an existing Artist
            agent.delete('/api/artists/' + artistSaveRes.body._id)
              .send(artist)
              .expect(200)
              .end(function (artistDeleteErr, artistDeleteRes) {
                // Handle artist error error
                if (artistDeleteErr) {
                  return done(artistDeleteErr);
                }

                // Set assertions
                (artistDeleteRes.body._id).should.equal(artistSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Artist if not signed in', function (done) {
    // Set Artist user
    artist.user = user;

    // Create new Artist model instance
    var artistObj = new Artist(artist);

    // Save the Artist
    artistObj.save(function () {
      // Try deleting Artist
      request(app).delete('/api/artists/' + artistObj._id)
        .expect(403)
        .end(function (artistDeleteErr, artistDeleteRes) {
          // Set message assertion
          (artistDeleteRes.body.message).should.match('User is not authorized');

          // Handle Artist error error
          done(artistDeleteErr);
        });

    });
  });

  it('should be able to get a single Artist that has an orphaned user reference', function (done) {
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

          // Save a new Artist
          agent.post('/api/artists')
            .send(artist)
            .expect(200)
            .end(function (artistSaveErr, artistSaveRes) {
              // Handle Artist save error
              if (artistSaveErr) {
                return done(artistSaveErr);
              }

              // Set assertions on new Artist
              (artistSaveRes.body.name).should.equal(artist.name);
              should.exist(artistSaveRes.body.user);
              should.equal(artistSaveRes.body.user._id, orphanId);

              // force the Artist to have an orphaned user reference
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

                    // Get the Artist
                    agent.get('/api/artists/' + artistSaveRes.body._id)
                      .expect(200)
                      .end(function (artistInfoErr, artistInfoRes) {
                        // Handle Artist error
                        if (artistInfoErr) {
                          return done(artistInfoErr);
                        }

                        // Set assertions
                        (artistInfoRes.body._id).should.equal(artistSaveRes.body._id);
                        (artistInfoRes.body.name).should.equal(artist.name);
                        should.equal(artistInfoRes.body.user, undefined);

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
      Artist.remove().exec(done);
    });
  });
});
