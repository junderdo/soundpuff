'use strict';

module.exports.profileUploadFileFilter = function (req, file, cb) {
  if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/gif') {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

module.exports.soundUploadFileFilter = function (req, file, cb) {
  if (file.mimetype !== 'audio/wav' && file.mimetype !== 'audio/mpeg') {
    return cb(new Error('Only WAV and MP3 files are allowed!'), false);
  }
  cb(null, true);
};
