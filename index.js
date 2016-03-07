'use strict';

var through = require('through2');
var gutil = require('gulp-util');
var util = require('util');
var buffertools = require('buffertools');
var PluginError = gutil.PluginError;

var PLUGIN_NAME = 'gulp-grep-fail';

function grepFailPlugin (predicates, options) {
  if (!predicates) {
    throw new PluginError(PLUGIN_NAME, 'No predicates specified.');
  }
  if (!options) {
    options = {
      expectMatch: false;
    };
  }

  predicates = Array.isArray(predicates) ? predicates : [ predicates ];

  return through.obj(function (file, enc, cb) {

    if (file.isBuffer()) {
      predicates.forEach(function (predicate) {
        var foundInBuffer = (buffertools.indexOf(file.contents, predicate) !== -1);
        if (foundInBuffer && !options.expectMatch) {
          cb(new PluginError(PLUGIN_NAME, util.format('\'%s\' contains \'%s\'.', file.path, predicate)));
        } else if (!foundInBuffer && options.expectMatch) {
          cb(new PluginError(PLUGIN_NAME, util.format('\'%s\' does not contain \'%s\'.', file.path, predicate)));
        }
      }.bind(this));
      cb(null, file);
    } else if (file.isStream()) {
      file.contents.on('data', function (data) {
        predicates.forEach(function (predicate) {
          var foundInStream = (buffertools.indexOf(data, predicate) !== -1);
          if (foundInStream && !expectMatch) {
            file.contents.removeAllListeners('end');
            cb(new PluginError(PLUGIN_NAME, util.format('\'%s\' contains \'%s\'.', file.path, predicate)));
          } else if (!foundInStream && expectMatch) {
            file.contents.removeAllListeners('end');
            cb(new PluginError(PLUGIN_NAME, util.format('\'%s\' does not contain \'%s\'.', file.path, predicate)));
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
