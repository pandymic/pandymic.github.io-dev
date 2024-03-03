const gulp = require( 'gulp' ),
  log = require( 'fancy-log' ),
  plumber = require('gulp-plumber'),
  sass = require('gulp-sass')( require('sass') ),
  shell = require( 'child_process' ).exec,
  uglify = require('gulp-uglify');

gulp.task( 'dist', () => {
  return gulp.src( [
    './src/**/*',
    '!./src/docs/sync',
    '!./src/docs/script.js',
    '!./src/docs/style.scss',
    '!./src/**/*.md',
    '!./src/**/.gitignore'
  ] )
    .pipe( gulp.dest( './dist' ) );
} );

gulp.task( 'style', () => {
  return gulp.src( './src/docs/style.scss' )
    .pipe( plumber() )
    .pipe( sass( {
      outputStyle: 'compressed',
      functions: {
        // Base64 encode strings for data url's within sass files.
        'pandymic-libsass-btoa($string)': function(string) {
          string.setValue( Buffer.from( string.getValue() ).toString( 'base64' ) );
          return string;
        }
      }
    } ) )
    .pipe( gulp.dest( './dist/docs' ) );
});

gulp.task( 'script', () => {
  return gulp.src( './src/docs/script.js' )
    .pipe( plumber() )
    .pipe( uglify() )
    .pipe( gulp.dest( './dist/docs' ) );
});

gulp.task( 'watch', () => {
  gulp.watch( './src/**/*', gulp.series( 'default' ) );
} );

gulp.task( 'default', gulp.series( 'dist', 'style', 'script' ) );