var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var njk = require('gulp-nunjucks-render');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');

// Static Server + watching sass/html files
gulp.task('browserSync', function() {
    browserSync.init({
        // notify: false,
        server: "subcms/templates"
    });
});

// setTimeout(function(){
//   browserSync.init({
//     notify: false,
//     proxy: "127.0.0.1:8000",
//     reloadDelay: 300,
//     reloadDebounce: 500
//   });
// }, 2000);

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

gulp.task('dev', ['browserSync', 'njk', 'sass'], function() {
    // Watch for changes in sass, nunjucks
    gulp.watch("media/sass/*.sass", ['sass']);
    gulp.watch("media/njk/**/*.njk", ['njk']);
    // Watch for changes in html, js
    gulp.watch("subcms/**/*.html").on('change', browserSync.reload);
    gulp.watch("media/js/*.js").on('change', browserSync.reload);
});

gulp.task('default', function() {
    console.log('hello world!, soon to be dist compiler');
});
