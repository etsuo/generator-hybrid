'use strict';

var eslint = require('gulp-eslint'),
    excludeGitignore = require('gulp-exclude-gitignore'),
    gulp = require('gulp'),
    istanbul = require('gulp-istanbul'),
    mocha = require('gulp-mocha'),
    nsp = require('gulp-nsp'),
    path = require('path'),
    plumber = require('gulp-plumber');

gulp.task('default', ['static', 'test']);
gulp.task('nsp', doNsp);
gulp.task('pre-test', doPreTest);
gulp.task('prepublish', ['nsp']);
gulp.task('static', doStatic);
gulp.task('test', ['pre-test'], doTest);


////////////

function doNsp(cb) {
    nsp({package: path.resolve('package.json')}, cb);
}

function doPreTest() {
    return gulp.src([
        'generators/app/index.js',
        'generators/app/lib/**/*.js'
    ]).pipe(istanbul({
        includeUntested: true
    })).pipe(istanbul.hookRequire());
}

function doStatic() {
    return gulp.src('**/*.js')
        .pipe(excludeGitignore())
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
}

function doTest(cb) {
    var mochaErr;

    gulp.src('test/**/*.js')
        .pipe(plumber())
        .pipe(mocha({reporter: 'spec'}))
        .on('error', function (err) {
            mochaErr = err;
        })
        .pipe(istanbul.writeReports())
        .on('end', function () {
            cb(mochaErr);
        });
}
