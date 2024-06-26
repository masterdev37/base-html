const { src, dest, parallel, series, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const scss = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cleancss = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const ssi = require("gulp-ssi");
const del = require('del');
const bssi = require('browsersync-ssi');

function browsersync() {
	browserSync.init({
		server: { 
			baseDir: 'app/',
			middleware: bssi({ baseDir: 'app/', ext: '.html' })
		},
		online: true,
		notify: false
	})
}

function styles() {
	return src([
		'app/css/style.css',
		]).pipe(browserSync.stream())
}

function images() {
	return src('app/images/**/*')
	.pipe(newer('app/images/'))
	.pipe(imagemin())
	.pipe(dest('dist/images/'))
}

function cleanimg() {
	return del('app/images/**/*', { force: true })
}

function cleandist() {
	return del('dist/**/*',  {force: true })
}

function buildCopy() {
	return src([
		'app/css/**/*.min.css',
		'app/css/**/*.css',
		'app/js/**/*.js',
		'app/**/*.html',
		'app/fonts/**/*',
		'app/images/**/*',
		'app/**/*.ico',
		'!app/parts/**/*.html',
	], { base: 'app' })
	.pipe(dest('dist'));
}

function buildHtml() {
	return src(['app/**/*.html', 'app/**/*.php', '!app/parts/**/*'])
	.pipe(ssi({ root: 'app/' }))
	.pipe(dest('dist'));
}

function startWatch() {
	watch('app/**/*.css', styles)
	watch(['app/**/*.js', '!app/**/*.min.js']);
	watch('app/**/*.html').on('change', browserSync.reload);
	watch('app/images/src/**/*', images);
}

exports.browsersync = browsersync;
exports.images = images;
exports.styles = styles;
exports.cleanimg = cleanimg;
exports.cleandist = cleandist;
exports.build = series(cleandist, styles, images, buildCopy, buildHtml);
exports.default = parallel(styles, browsersync, startWatch);