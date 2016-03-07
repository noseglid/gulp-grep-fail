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
    options = {};
  }

  predicates = Array.isArray(predicates) ? predicates : [ predicates ];

  return through.obj(function (file, enc, cb) {

    if (file.isBuffer()) {
      var hasFailed = predicates.some(function (predicate) {
        var foundInBuffer = (buffertools.indexOf(file.contents, predicate) !== -1);
        if (foundInBuffer && !options.inverse) {
          cb(new PluginError(PLUGIN_NAME, util.format('\'%s\' contains \'%s\'.', file.path, predicate)));
          return true
        } else if (!foundInBuffer && options.inverse) {
          cb(new PluginError(PLUGIN_NAME, util.format('\'%s\' does not contain \'%s\'.', file.path, predicate)));
          return true
        }
      }.bind(this));
      if (false === hasFailed) {
        cb(null, file);
      }
    } else if (file.isStream()) {
      var hasFailed = file.contents.on('data', function (data) {
        predicates.some(function (predicate) {
          var foundInStream = (buffertools.indexOf(data, predicate) !== -1);
          if (foundInStream && !options.inverse) {
            file.contents.removeAllListeners('end');
            cb(new PluginError(PLUGIN_NAME, util.format('\'%s\' contains \'%s\'.', file.path, predicate)));
            return true
          } else if (!foundInStream && options.inverse) {
            file.contents.removeAllListeners('end');
            cb(new PluginError(PLUGIN_NAME, util.format('\'%s\' does not contain \'%s\'.', file.path, predicate)));
            return true
          }
        }.bind(this));
      });

      file.contents.on('end', function () {
        if (hasFailed === false) {
          cb(null, file);
        }
      });
    }
  });
}

module.exports = grepFailPlugin;
