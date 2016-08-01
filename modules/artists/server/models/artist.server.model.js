'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Artist Schema
 */
var ArtistSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Artist name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Artist', ArtistSchema);
