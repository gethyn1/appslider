var gulp    		= require('gulp'); 			
var fs 				= require('fs');
var es 				= require('event-stream');
var path 			= require('path');
var sass            = require('gulp-sass');
var autoprefixer   	= require('gulp-autoprefixer');
var notify 			= require("gulp-notify");
var livereload 		= require('gulp-livereload');
var jshint 			= require('gulp-jshint');


// Gulp environment paths
var devPath 		= './';
var distPath 		= '../assets/';

// Gulp watch paths
var watchPaths		= {
	scripts: 	[devPath + 'js/**/*.js'],
	sass: 		[devPath + 'sass/**/*.scss']
};

// Lint javascript
gulp.task('jshint', function() {
    return gulp
    	.src([devPath + 'js/objects/*.js', devPath + 'js/utils/*.js', devPath + 'js/app.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'))
        .on('error', notify.onError({ message: "Error: <%= error.message %>", title: "Error running lint task" }));
});

// Compile javascript
gulp.task('scripts', function(){
	return gulp
		.src(devPath + 'js/*.js')
		.on("error", notify.onError({ message: "Error: <%= error.message %>", title: "Error running scripts task" }))
		.pipe(gulp.dest(distPath + 'js'));
});

// Compile sass
gulp.task('sass', function () {
	return gulp
		.src(devPath + 'sass/style.scss')
		.pipe(sass())
		.on("error", notify.onError({ message: "Error: <%= error.message %>", title: "Error running sass task" }))
		.pipe(autoprefixer({ browsers: ['> 1%', 'last 2 versions'], cascade: false }))
		.on("error", notify.onError({ message: "Error: <%= error.message %>", title: "Error running sass task" }))
		.on("error", notify.onError({ message: "Error: <%= error.message %>", title: "Error running sass task" }))
		.pipe(gulp.dest(distPath + 'css'));
});

// Watch task
gulp.task('watch', function() {
	gulp.watch(watchPaths.sass, ['sass']);
	gulp.watch(watchPaths.scripts, ['jshint', 'scripts']);

	livereload.listen();
	gulp.watch(distPath + '**').on('change', livereload.changed);
});

// Default gulp task
gulp.task('default', ['jshint', 'scripts', 'sass', 'watch']);