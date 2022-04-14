import gulp from 'gulp'
import autoprefixer from 'gulp-autoprefixer'
import fileinclude from 'gulp-file-include'
import browserSync from 'browser-sync'
import clean from 'gulp-clean'
import concat from 'gulp-concat'
import dartSass from 'sass'
import gulpSass from 'gulp-sass'
import imagemin from 'gulp-imagemin'
import cleanCSS from 'gulp-clean-css'
import uglify from 'gulp-uglify'
import htmlmin from 'gulp-htmlmin'


const sass = gulpSass(dartSass);
browserSync.create()

// PATHS

const path = {
	src: {
		html: './src/pages/*.html',
		scss: './src/scss/**/*.scss',
		js: './src/js/*.js',
		img: './src/images/*',
		fonts: './src/fonts/*',
	},
	prod: {
		self: './build/',
		html: './build/',
		css: './build/styles/',
		js: './build/js/',
		img: './build/images',
		fonts: './build/fonts',
	},
}

// PATHS

const updatedImgs = () => gulp.src(path.src.img, {allowEmpty: true}).pipe(imagemin()).pipe(gulp.dest(path.prod.img))

const updatedFonts = () => gulp.src(path.src.fonts).pipe(gulp.dest(path.prod.fonts))

const updatedHtml = () =>
	gulp
		.src(path.src.html)
		.pipe(
			fileinclude({
				prefix: '@@',
				basepath: '@file',
			}),
		)
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(gulp.dest(path.prod.html))
		.pipe(browserSync.stream())

const updatedScss = () =>
	gulp
		.src(path.src.scss)
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({ cascade: false }))
		.pipe(cleanCSS({compatibility: 'ie8'}))
		.pipe(gulp.dest(path.prod.css))
		.pipe(browserSync.stream())

const updatedJs = () => gulp.src(path.src.js).pipe(concat('index.js')).pipe(uglify()).pipe(gulp.dest(path.prod.js)).pipe(browserSync.stream())

const cleanBuild = () => gulp.src(path.prod.self, { read: false, allowEmpty: true }).pipe(clean())


const watcher = () => {
	browserSync.init({
		server: path.prod.html,
	})
	gulp.watch('./src/**/*.html'	, updatedHtml).on('change', browserSync.reload)
	gulp.watch(path.src.scss, updatedScss).on('change', browserSync.reload)
	gulp.watch(path.src.js, updatedJs).on('change', browserSync.reload)
	gulp.watch(path.src.img, updatedImgs).on('change', browserSync.reload)
	gulp.watch(path.src.fonts, updatedFonts).on('change', browserSync.reload)
}

gulp.task('default', gulp.series(cleanBuild, updatedHtml, updatedScss, updatedJs, updatedImgs, updatedFonts, watcher))