'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Artist = mongoose.model('Artist'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Artist
 */
exports.create = function(req, res) {
  var artist = new Artist(req.body);
  artist.user = req.user;

  artist.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(artist);
    }
  });
};

/**
 * Show the current Artist
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var artist = req.artist ? req.artist.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  artist.isCurrentUserOwner = req.user && artist.user && artist.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(artist);
};

/**
 * Update a Artist
 */
exports.update = function(req, res) {
  var artist = req.artist ;

  artist = _.extend(artist , req.body);

  artist.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(artist);
    }
  });
};

/**
 * Delete an Artist
 */
exports.delete = function(req, res) {
  var artist = req.artist ;

  artist.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(artist);
    }
  });
};

/**
 * List of Artists
 */
exports.list = function(req, res) { 
  Artist.find().sort('-created').populate('user', 'displayName').exec(function(err, artists) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(artists);
    }
  });
};

/**
 * Artist middleware
 */
exports.artistByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Artist is invalid'
    });
  }

  Artist.findById(id).populate('user', 'displayName').exec(function (err, artist) {
    if (err) {
      return next(err);
    } else if (!artist) {
      return res.status(404).send({
        message: 'No Artist with that identifier has been found'
      });
    }
    req.artist = artist;
    next();
  });
};
