var gulp = require('gulp'),

    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    //jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    lr = require('tiny-lr'),
    server = lr(),

    PORT_EXPRESS = 4000,
    PORT_LIVERELOAD = 35729,
    EXPRESS_ROOT = __dirname
    ;

gulp.task('mg_test', function() {
  console.log('here');
  var secret = require('./util/secret'),
  MusicGraphApi = require('./util/musicgraph'),
  MG = new MusicGraphApi(secret.api_key_musicgraph);
  MG.similarArtists(function(err, data) {
    console.dir(data);
  });
});

gulp.task('oa', function() {
  var OA = require('openaura-api');
  console.dir(OA);
});

// Styles
gulp.task('styles', function() {
  return gulp.src('app/scss/main.scss')
    .pipe(sass({ style: 'expanded', includePaths: require('node-bourbon').includePaths.concat(require('node-neat').includePaths), }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('app/css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(livereload(server))
    .pipe(gulp.dest('app/css/min'))
    .pipe(notify({ message: 'Styles task complete' }));
});

// Scripts
gulp.task('scripts', function() {
  return gulp.src('app/scripts/src/**/*.js')
    //.pipe(jshint('.jshintrc'))
    //.pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('app/scripts/min'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(livereload(server))
    .pipe(gulp.dest('app/scripts/min'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

// Images
gulp.task('images', function() {
  return gulp.src('app/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(livereload(server))
    .pipe(gulp.dest('app/images'))
    .pipe(notify({ message: 'Images task complete' }));
});

// Templates
gulp.task('templates', function() {
  return gulp.src('app/views/**/*.hbs')
    .pipe(livereload(server))
    .pipe(notify({ message: 'Templates task complete' }));
});

/*
// for later, if serving up the mins from new dirs
// Clean
gulp.task('clean', function() {
  return gulp.src(['dist/styles', 'dist/scripts', 'dist/images'], {read: false})
    .pipe(clean());
});
*/

gulp.task('startExpress', function() {
  var express = require('express');
      routes = require('./routes'),
      http = require('http'),
      path = require('path'),
      cons = require('consolidate'),
      app = express();

  // use handlebars
  app.set('views', path.join(EXPRESS_ROOT, 'app/views'));
  app.engine('hbs', cons.handlebars);
  app.set('view engine', 'hbs');

  app.use(require('connect-livereload')());
  app.use(express.static(path.join(EXPRESS_ROOT, 'app')));
  app.listen(PORT_EXPRESS);

  app.get('/', routes.index);
});

gulp.task('startLivereload', function() {
  server.listen(PORT_LIVERELOAD);
});

gulp.task('updateLivereload', function(event) {
  gulp.src(event.path, {read: false})
      .pipe(require('gulp-livereload')(lr));
});
 
// Default task
//gulp.task('default', ['clean'], function() {
gulp.task('default', ['startExpress','startLivereload','scripts','styles','images','templates'], function() {
  // Watch .scss files
  gulp.watch('app/scss/**/*.scss', ['styles']);
  // Watch .js files
  gulp.watch('app/scripts/**/*.js', ['scripts']);
  // Watch image files
  gulp.watch('app/images/**/*', ['images']);
  // Watch templates
  gulp.watch('app/views/**/*.hbs', ['templates']);
});


