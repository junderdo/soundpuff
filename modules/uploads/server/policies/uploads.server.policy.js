'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Uploads Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/uploads',
      permissions: '*'
    }, {
      resources: '/api/uploads/:uploadId',
      permissions: '*'
    },
    {
      resources: '/api/uploads/receive',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/uploads',
      permissions: ['get', 'post']
    }, {
      resources: '/api/uploads/:uploadId',
      permissions: ['get']
    },
    {
      resources: '/api/uploads/receive',
      permissions: ['post']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/uploads',
      permissions: ['get']
    }, {
      resources: '/api/uploads/:uploadId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Uploads Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Upload is being processed and the current user created it then allow any manipulation
  if (req.upload && req.user && req.upload.user && req.upload.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
