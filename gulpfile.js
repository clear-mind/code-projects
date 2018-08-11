const gulp = require('gulp');
const runSequence = require('run-sequence');
const bump = require('gulp-bump');
const shell = require('gulp-shell')
const p = require('./package.json')

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

gulp.task('default', ['deploy']);