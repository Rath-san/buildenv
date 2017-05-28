var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var njk = require('gulp-nunjucks-render');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var imagemin = require('gulp-imagemin');
var exec = require('child_process').exec;
var child = require('child_process');

// gulp.task('img', function() {
//     gulp.src('media/images/**/*')
//         .pipe(imagemin())
//         .pipe(gulp.dest('media/images'));
// });

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

// gulp.task('views', function buildHTML() {
//   return gulp.src('views/*.pug')
//   .pipe(pug({
//     // Your options in here.
//   }))
// });

// nunjucks html render
gulp.task('njk', function() {
    return gulp.src('media/njk/pages/*.njk')
        .pipe(plumber())
        .pipe(njk({
            path: ['media/njk/templates/'] // String or Array
        }))
        .pipe(gulp.dest('subcms/templates'));
});


var sassPaths = [
  'bower_components/bootstrap-sass/assets/stylesheets'
];


// sass compiler
gulp.task('sass', function() {
    return gulp.src(['media/sass/*.sass','media/sass/*.scss'])
        .pipe(sass({
            includePaths: sassPaths,
            // outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: [
                "Android 2.3",
                "Android >= 4",
                "Chrome >= 20",
                "Firefox >= 24",
                "Explorer >= 8",
                "iOS >= 6",
                "Opera >= 12",
                "Safari >= 6"
            ],
            cascade: false
        }))
        // .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest('media/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('front', ['browserSync', 'njk', 'sass'], function() {
    gulp.watch("media/sass/**/*.{sass,scss}", ['sass']);
    gulp.watch("media/js/*.js").on('change', reload);
    gulp.watch("media/njk/**/*.njk", ['njk']);
    gulp.watch("subcms/**/*.html").on('change', reload);

});

// BACKEND ===============================================
// gulp.task('django', function(){
//
//   var spawn = child.spawn;
//   console.info('Starting django server');
//   var PIPE = {
//     stdio: 'inherit'
//   };
//   spawn('python', ['manage.py','runserver'], PIPE);
// });
//
// gulp.task('runserver', function() {
//     var isWin = /^win/.test(process.platform);
//      var cmd =  'source .../venv/bin/activate';
//      console.log(cmd);
//     if (isWin) { //for Windows
//         cmd = '..\\Scripts\\activate';
//     }
//
//     var proc = exec(cmd);
// });
//
// gulp.task('default', ['django','sass'], function() {
//   console.log('hello world!, watch, sass, js');
//   setTimeout(function(){
//     browserSync.init({
//       notify: true,
//       proxy: "127.0.0.1:8000",
//       reloadDelay: 300,
//       reloadDebounce: 500
//     });
//   }, 2000);
//   // Watch for changes in sass, nunjucks
//   gulp.watch("media/sass/**/*.+(sass,scss)", ['sass']);
//   // gulp.watch("nunjucks/**/*.njk", ['nunjucks']);
//   // Watch for changes in html, js
//   gulp.watch("templates/**/*.html").on('change', reload);
//   gulp.watch("media/js/*.js").on('change', reload);
//   // gulp.watch(["../subcms/**/*.html"], reload);
// });
