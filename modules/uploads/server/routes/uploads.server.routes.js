'use strict';

/**
 * Module dependencies
 */
var uploadsPolicy = require('../policies/uploads.server.policy'),
  uploads = require('../controllers/uploads.server.controller');

module.exports = function(app) {
  // Uploads Routes
  app.route('/api/uploads').all(uploadsPolicy.isAllowed)
    .get(uploads.list)
    .post(uploads.create);

  app.route('/api/uploads/:uploadId').all(uploadsPolicy.isAllowed)
    .get(uploads.read)
    .put(uploads.update)
    .delete(uploads.delete);

  // Finish by binding the Upload middleware
  app.param('uploadId', uploads.uploadByID);
};
