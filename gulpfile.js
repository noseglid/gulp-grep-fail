'use strict';

var gulp = require('gulp');
var grepFail = require('./');

gulp.task('default', function () {
  return gulp.src('index.js')
    .pipe(grepFail([ 'file' ]));
});
