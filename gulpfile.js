// npm install gulp gulp-uglify gulp-rename gulp-babel gulp-debug babel-preset-es2015
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var babel = require('gulp-babel');
var debug = require('gulp-debug');

gulp.task('copy_files', function() {
    gulp
        .src([
            './www_source/*.*',
        ])
        .pipe(debug())
        .pipe(gulp.dest('./app/src/main/assets/www/'))
        .on('error', function (error) {
            console.error('' + error);
        });

    gulp
        .src([
            './www_source/index.html',
        ])
        .pipe(debug())
        .pipe(gulp.dest('./app/src/main/assets/www/'))
        .on('error', function (error) {
            console.error('' + error);
        });
		
    gulp
        .src([
            './www_source/js/webix/codebase/webix.js',
            './www_source/js/webix/codebase/webix.css'
        ])
        .pipe(debug())
        .pipe(gulp.dest('./app/src/main/assets/www/js/webix/codebase/'))
        .on('error', function (error) {
            console.error('' + error);
        });

    gulp
        .src([
            './www_source/js/webix/codebase/skins/material.css'
        ])
        .pipe(debug())
        .pipe(gulp.dest('./app/src/main/assets/www/js/webix/codebase/skins/'))
        .on('error', function (error) {
            console.error('' + error);
        });

    gulp
        .src([
            './www_source/js/webix/codebase/fonts/*.*'
        ])
        .pipe(debug())
        .pipe(gulp.dest('./app/src/main/assets/www/js/webix/codebase/fonts/'))
        .on('error', function (error) {
            console.error('' + error);
        });
});

gulp.task('min_js', function() {
    return gulp.src(['./www_source/js/*.js'])
        .pipe(debug())
        .pipe(babel({ presets: ['es2015'], compact: false }))
        .pipe(uglify())
        .pipe(gulp.dest('./app/src/main/assets/www/js/'))
		.on('error', function (error) {
            console.error('' + error);
        });
});

gulp.task('default', ['copy_files', 'min_js']);
