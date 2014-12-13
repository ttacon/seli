var gulp = require('gulp'),
    minifyCSS = require('gulp-minify-css'),
    filesize = require('gulp-filesize'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint');

gulp.task('default', ['cssmin', 'uglify', 'jslint']);

gulp.task('jslint', function() {
		return gulp.src('./js/src/seli.js')
			.pipe(jshint())
			.pipe(jshint.reporter());
	});

gulp.task('uglify', function() {
		return gulp.src('./js/src/seli.js')
			.pipe(filesize())
			.pipe(uglify())
			.pipe(filesize())
			.pipe(rename({ suffix: '.min' }))
			.pipe(gulp.dest('./dist'))
			.on('error', gutil.log);
	});

gulp.task('watch', function() {
		gulp.watch('./src/*', ['uglify', 'jslint']);
	});