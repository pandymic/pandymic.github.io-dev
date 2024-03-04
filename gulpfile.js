const gulp = require( 'gulp' ),
  handlebars = require( 'gulp-compile-handlebars' ),
  log = require( 'fancy-log' ),
  markdown = require( 'gulp-markdown-it' ),
  plumber = require( 'gulp-plumber' ),
  rename = require( 'gulp-rename' ),
  sass = require( 'gulp-sass' )( require( 'sass' ) ),
  shell = require( 'child_process' ).exec,
  uglify = require( 'gulp-uglify' );

gulp.task( 'markdown', () => {
  return gulp.src(  './src/markdown/*.md'  )
    .pipe( markdown( {
      html: true,
      linkify: true
    } ) )
    .pipe( rename( function( path ) {
      path.extname = ".handlebars"
    } ) )
    .pipe( gulp.dest( './src/partials' ) );
} );

gulp.task( 'handlebars', () => {
  return gulp.src(  './src/docs/**/*.handlebars'  )
    .pipe( handlebars( {}, {
      batch : [ './src/partials' ]
    } ) )
    .pipe( rename( function( path ) {
      path.extname = ".html"
    } ) )
    .pipe( gulp.dest( './dist/docs' ) );
} );

gulp.task( 'dist', () => {
  return gulp.src( [
    './src/**/*',
    '!./src/docs/script.js',
    '!./src/docs/style.scss',
    '!./src/docs/**/*.handlebars'
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

gulp.task( 'default', gulp.series( 'markdown', 'handlebars', 'dist', 'style', 'script' ) );
