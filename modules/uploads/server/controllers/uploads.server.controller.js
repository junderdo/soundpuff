'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  fs = require('fs'),
  mongoose = require('mongoose'),
  Upload = mongoose.model('Upload'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  _ = require('lodash');


exports.uploadSound = function (req, res) {
  var message = null;
  var uploader = multer(config.uploads.soundUpload).single('newSoundUpload');
  var soundUploadFileFilter = require(path.resolve('./config/lib/multer')).soundUploadFileFilter;

  // Filtering to upload only images
  uploader.fileFilter = soundUploadFileFilter;

  if (uploader) {
    uploader(req, res, function (uploadError) {
      if(uploadError) {
        return res.status(400).send({
          message: 'Error occurred while uploading sound'
        });
      } else {
        res.json({'status': 'ok'});
      }
    });
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};

/**
 * Create a Upload
 */
exports.create = function(req, res) {
  var upload = new Upload(req.body);
  upload.user = req.user;

  var message = null;

  upload.save(function(err) {
    //  upload.filePath = config.uploads.soundUpload.dest + req.file.filename;
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(upload);
    }
  });

};

/**
 * Show the current Upload
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var upload = req.upload ? req.upload.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  upload.isCurrentUserOwner = req.user && upload.user && upload.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(upload);
};

/**
 * Update a Upload
 */
exports.update = function(req, res) {
  var upload = req.upload ;

  upload = _.extend(upload , req.body);

  upload.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(upload);
    }
  });
};

/**
 * Delete an Upload
 */
exports.delete = function(req, res) {
  var upload = req.upload ;

  upload.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(upload);
    }
  });
};

/**
 * List of Uploads
 */
exports.list = function(req, res) {
  Upload.find().sort('-created').populate('user', 'displayName').exec(function(err, uploads) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(uploads);
    }
  });
};

/**
 * Upload middleware
 */
exports.uploadByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Upload is invalid'
    });
  }

  Upload.findById(id).populate('user', 'displayName').exec(function (err, upload) {
    if (err) {
      return next(err);
    } else if (!upload) {
      return res.status(404).send({
        message: 'No Upload with that identifier has been found'
      });
    }
    req.upload = upload;
    next();
  });
};
