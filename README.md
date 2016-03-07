# gulp-grep-fail

Greps through the data on the gulp stream and fails the build if any
of the specified strings occur in the piped files, or optionally fails
 the build if any of the strings are not found.

## Installation

Easy as cake.

>    npm install gulp-grep-fail

## Usage

Grep through all mocha tests for any `only` tests.

    gulp.task('default', function () {
      return gulp.src('test/**/*.js')
        .pipe(grepFail([ 'it.only', 'describe.only' ]));
    });

Grep through a file where you expect a specific version number to appear. 

    Contents of foo.js
    ==========================
    {
      version: '123';
    }
    ==========================

    gulp.task('default', function () {
      return gulp.src('foo.js')
        .pipe(grepFail('123', {inverse: true}));
    });

## API

`grepFail(predicates, [options])`

  * **predicates** `(string|array)` string(s) to grep for and fail if they exist
  * **options.expectMatch** `(boolean) - optional` default behaviour is to throw an error if a match is found. Optionally, you can set this param to true so that it fails if it is expecting values to match.

## License

MIT
