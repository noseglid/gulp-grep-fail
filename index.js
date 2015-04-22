'use strict';

var through = require('through2');
var gutil = require('gulp-util');
var util = require('util');
var buffertools = require('buffertools');
var PluginError = gutil.PluginError;

var PLUGIN_NAME = 'gulp-grep-fail';

function grepFailPlugin (predicates) {
  if (!predicates) {
    throw new PluginError(PLUGIN_NAME, 'No predicates specified.');
  }

  predicates = Array.isArray(predicates) ? predicates : [ predicates ];

  return through.obj(function (file, enc, cb) {

    if (file.isBuffer()) {
      console.log('its a buffer');
      predicates.forEach(function (predicate) {
        if (-1 !== buffertools.indexOf(file.contents, predicate)) {
          cb(new PluginError(PLUGIN_NAME, util.format('\'%s\' contains \'%s\'.', file.path, predicate)));
        }
      }.bind(this));
      cb(null, file);
    } else if (file.isStream()) {
      console.log('its a stream');
      file.contents.on('data', function (data) {
        predicates.forEach(function (predicate) {
          if (-1 !== buffertools.indexOf(data, predicate)) {
            file.contents.removeAllListeners('end');
            cb(new PluginError(PLUGIN_NAME, util.format('\'%s\' contains \'%s\'.', file.path, predicate)));
          }
        }.bind(this));
      });

      file.contents.on('end', function () {
        cb(null, file);
      });
    }
  });
}

module.exports = grepFailPlugin;
