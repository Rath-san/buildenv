var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var njk = require('gulp-nunjucks-render');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
// var uglify = require('gulp-uglify');
// var cleanCSS = require('gulp-clean-css');
// var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var exec = require('child_process').exec;
var child = require('child_process');

gulp.task('img', function() {
    gulp.src('media/images/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('media/images'));
});

// Static Server
gulp.task('browserSync', function() {
    browserSync.init({
        // notify: false,
        server: {
          baseDir: ["./", "subcms/templates"]
          }
        }
    );
});

// nunjucks html render
gulp.task('njk', function() {
    return gulp.src('media/njk/pages/*.njk')
        .pipe(plumber())
        .pipe(njk({
            path: ['media/njk/templates/'] // String or Array
        }))
        .pipe(gulp.dest('subcms/templates'));
});

// sass compiler
gulp.task('sass', function() {
    return gulp.src('media/sass/main.sass')
        .pipe(sass({
            style: 'compressed'
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        // .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest('media/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('front', ['browserSync', 'njk', 'sass'], function() {
    // Watch for changes in sass, nunjucks
    gulp.watch("media/sass/*.sass", ['sass']);
    gulp.watch("media/njk/**/*.njk", ['njk']);
    // Watch for changes in html, js
    gulp.watch("subcms/**/*.html").on('change', browserSync.reload);
    gulp.watch("media/js/*.js").on('change', browserSync.reload);
    gulp.watch("media/img/").on('change', browserSync.reoad);
});

// BACKEND ===============================================
gulp.task('django', function(){

  var spawn = child.spawn;
  console.info('Starting django server');
  var PIPE = {
    stdio: 'inherit'
  };
  spawn('python', ['manage.py','runserver'], PIPE);
});

gulp.task('runserver', function() {
    var isWin = /^win/.test(process.platform);
     var cmd =  'source .../venv/bin/activate';
     console.log(cmd);
    if (isWin) { //for Windows
        cmd = '..\\Scripts\\activate';
    }

    var proc = exec(cmd);
});

gulp.task('default', ['django','sass'], function() {
  console.log('hello world!, watch, sass, js');
  setTimeout(function(){
    browserSync.init({
      notify: false,
      proxy: "127.0.0.1:8000",
      reloadDelay: 300,
      reloadDebounce: 500
    });
  }, 2000);
  // Watch for changes in sass, nunjucks
  gulp.watch("media/sass/*.sass", ['sass']);
  // gulp.watch("nunjucks/**/*.njk", ['nunjucks']);
  // Watch for changes in html, js
  gulp.watch("templates/**/*.html").on('change', reload);
  gulp.watch("media/js/*.js").on('change', reload);
  // gulp.watch(["../subcms/**/*.html"], reload);
});
