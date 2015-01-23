'use strict';


/**
* Dependencies
*/
var gulp       = require('gulp'),
	jshint     = require('gulp-jshint'),
	jasmine    = require('gulp-jasmine-phantom');


/**
* Define our groups of files
*/
var paths = {
	js: [
		'domit.js',
		'gulpfile.js',
		'test/*.spec.js'
	],
	test: [
		'./test/*.spec.js'
	],
	testvendor: [
		'domit.js',
		'test/lib/jquery.min.js'
	]
};


/**
* lint task definition
*/
gulp.task('lint', function () {
	gulp.src(paths.js)
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});


/**
* run tests
*/
gulp.task('test', function () {
	gulp.src(paths.test)
		.pipe(jasmine({
			integration: true,
			vendor: paths.testvendor
		}));
});


/**
* default task will be nodemon
*/
gulp.task('default', ['lint'], function(){
	gulp.watch(paths.js, ['lint']);
});
