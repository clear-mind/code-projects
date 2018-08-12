const gulp = require('gulp');
const runSequence = require('run-sequence');
const bump = require('gulp-bump');
const shell = require('gulp-shell')
const p = require('./package.json')
const sass = require('gulp-sass');

gulp.task('bump', function(){
	return gulp.src('./package.json')
		.pipe(bump({type:'patch'}))
		.pipe(gulp.dest('./'));
});
gulp.task('publish', shell.task([
	'npm publish',
], {cwd: '.'}))// 	'parse deploy',

gulp.task('after', shell.task([`npm install -g ${p.name}@latest`]))

gulp.task('default', ['build']);

gulp.task('set-dev-node-env', function() {
	return process.env.NODE_ENV = 'development';
});

gulp.task('compile-scss', function() {
    gulp.src('src/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest(function(f) {
            return f.base;
        }))
});

gulp.task('set-prod-node-env', function() {
	return process.env.NODE_ENV = 'production';
});

gulp.task('build', ['set-prod-node-env'], function(callback) {
    runSequence(
        'bump',
        callback);
});

gulp.task('deploy', function(callback) {
	runSequence(
		'build',
		'publish',
		'after',
		callback);
});

gulp.task('scss', ['compile-scss'], function() {
    gulp.watch('src/**/*.scss', ['compile-scss']);
})

gulp.task('default', ['deploy']);