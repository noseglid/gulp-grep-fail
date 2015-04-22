# gulp-grep-fail

Greps through the data on the gulp stream and fails the build if any
of the specified strings occur in the piped files.

## Installation

Easy as cake.

>    npm install gulp-grep-fail

## Usage

Grep through all mocha tests for any `only` tests.

    gulp.task('default', function () {
      return gulp.src('test/**/*.js')
        .pipe(grepFail([ 'it.only', 'describe.only' ]));
    });

## API

`grepFail(predicates)`

  * **predicates** `(string|array)` string(s) to grep for and fail if they exist

## License

MIT
