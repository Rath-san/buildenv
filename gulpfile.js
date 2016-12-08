var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var nunjucksRender = require('gulp-nunjucks-render');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');

// Static Server + watching sass/html files
gulp.task('browserSync', function() {
    browserSync.init({
        server: "dev"
    });
});

// nunjucks html render
gulp.task('nunjucks', function() {
    return gulp.src('dev/nunjucks/pages/*.nunjucks')
        .pipe(plumber())
        .pipe(nunjucksRender({
            path: ['dev/nunjucks/templates/'] // String or Array
        }))
        .pipe(gulp.dest('dev'));
});

// sass compiler
gulp.task('sass', function() {
    return gulp.src('dev/sass/main.sass')
        .pipe(sass({
            style: 'compressed'
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        // .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest('dev/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// Minify compiled CSS
// gulp.task('minify-css', ['sass'], function() {
//     return gulp.src('dev/css/main.css')
//         .pipe(cleanCSS({
//             compatibility: 'ie8'
//         }))
//         .pipe(rename({
//             suffix: '.min'
//         }))
//         .pipe(gulp.dest('dev/css'));
// });

// Minify JS
// gulp.task('minify-js', function() {
//     return gulp.src('dev/js/main.js')
//         .pipe(uglify())
//         .pipe(rename({
//             suffix: '.min'
//         }))
//         .pipe(gulp.dest('dev/js'));
// });

gulp.task('concat-js', function() {
    return gulp.src(['dev/js/jquery.js',
            'dev/js/bootstrap.js',
            'dev/js/contact_me.js',
            'dev/js/agency.js',
            '!**/*.min.js'
        ])
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('concat-css', function() {
    return gulp.src(['dev/css/*.css',
            '!**/*.min.css'
        ])
        .pipe(concat('main.css'))
        .pipe(cleanCSS({
            compatibility: 'ie8'
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./dist/css'));
});

// copy components <-- bedzie do zmiany
gulp.task('copy', function() {
    // Bootstrap
    gulp.src(['vendor/bootstrap/dist/**/*.css',
            '!**/bootstrap-theme.*',
            '!**/*.map'
        ])
        .pipe(gulp.dest('dev/'));
    gulp.src(['vendor/bootstrap/dist/**/*.js',
            '!**/npm.js'
        ])
        .pipe(gulp.dest('dev/'));
    gulp.src(['vendor/bootstrap/dist/fonts/**', ])
        .pipe(gulp.dest('dev/fonts'));
    // Jquery
    gulp.src(['vendor/jquery/dist/jquery.js',
            'vendor/jquery/dist/jquery.min.js'
        ])
        .pipe(gulp.dest('dev/js'));
    // Font-awesome
    gulp.src([
            'vendor/font-awesome/**/*.css',
            '!**/*.map'
        ])
        .pipe(gulp.dest('dev/'));
    gulp.src([
            'vendor/font-awesome/fonts/**',
        ])
        .pipe(gulp.dest('dev/fonts'));
});

gulp.task('movecss', function() {
    gulp.src(['vendor/**/*.min.css',
            '!**/bootstrap-theme.*',
            '!**/*.map'
        ])
        .pipe(rename({
            dirname: ''
        }))
        .pipe(gulp.dest('move/css'));
});

gulp.task('movejs', function() {
    gulp.src(['vendor/**/*.min.js',
            '!**/npm.js',
            '!**/*.slim.min.js',
            '!**/sizzle.*'
        ])
        .pipe(rename({
            dirname: ''
        }))
        .pipe(gulp.dest('move/js'));
});

gulp.task('dev', ['browserSync', 'nunjucks', 'sass'], function() {
    // Watch for changes in sass, nunjucks
    gulp.watch("dev/sass/*.sass", ['sass']);
    gulp.watch("dev/nunjucks/**/*.nunjucks", ['nunjucks']);
    // Watch for changes in html, js
    gulp.watch("dev/*.html").on('change', browserSync.reload);
    gulp.watch("dev/js/*.js").on('change', browserSync.reload);
});

gulp.task('default', function() {
    console.log('hello world!, soon to be dist compiler');
});
