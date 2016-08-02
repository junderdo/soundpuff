'use strict';

/**
 * Module dependencies
 */
var artistsPolicy = require('../policies/artists.server.policy'),
  artists = require('../controllers/artists.server.controller');

module.exports = function(app) {
  // Artists Routes
  app.route('/api/artists').all(artistsPolicy.isAllowed)
    .get(artists.list)
    .post(artists.create);

  app.route('/api/artists/:artistId').all(artistsPolicy.isAllowed)
    .get(artists.read)
    .put(artists.update)
    .delete(artists.delete);

  // Finish by binding the Artist middleware
  app.param('artistId', artists.artistByID);
};
