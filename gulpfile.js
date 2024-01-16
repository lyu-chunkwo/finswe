const { src, dest, watch, parallel, series } = require('gulp');
const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify-es').default;
const imagemin = require('gulp-imagemin');
const del = require('del');
const browserSync = require('browser-sync').create();
const svgSprite = require('gulp-svg-sprite');
const newer = require('gulp-newer');
const fonter = require('gulp-fonter');
const ttf2woff2 = require('gulp-ttf2woff2');
const fileInclude = require('gulp-file-include');
const webp = require('gulp-webp');
const webpHtml = require('gulp-webp-html');
const webpCss = require('gulp-webp-css');

function htmlInclude() {
  return src(['./src/*.html'])
    .pipe(fileInclude({
      prefix: '@',
      basepath: '@file'
    }))
    .pipe(webpHtml())
    .pipe(dest('./app'))
    .pipe(browserSync.stream());
}

function fonts() {
  return src('app/fonts/src/*.*')
  .pipe(fonter({
    formats: ['woff', 'ttf']
  }))
  .pipe(src('app/fonts/*.ttf'))
  .pipe(ttf2woff2())
  .pipe(dest('app/fonts'))
}

function styles() {
  return src('app/scss/style.scss')
    .pipe(scss({ outputStyle: 'compressed' }))
    .pipe(webpCss())
    .pipe(concat('style.min.css'))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 10 versions'],
      grid: true
    }))
    .pipe(dest('app/css'))
    .pipe(browserSync.stream());
}

function scripts() {
  return src([
    'app/js/main.js'
  ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream());
}

function images() {
  return src(['app/images/src/**/*.*'])
  .pipe(newer('app/images/result'))
  .pipe(webp())
  
  .pipe(src('app/images/src/**/*.*'))
  .pipe(newer('app/images/result'))
  .pipe(imagemin([
      imagemin.gifsicle({ interlaced: true }),
      imagemin.mozjpeg({ quality: 75, progressive: true }),
      imagemin.optipng({ optimizationLevel: 5 }),
      imagemin.svgo({
        plugins: [
          { removeViewBox: true },
          { cleanupIDs: false }
        ]
      })
    ]))
  .pipe(dest('app/images/result'))
}

function svgSprites() {
  return src('app/images/ico/**.svg')
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: "../sprite.svg"
        }
      }
    }))
    .pipe(dest('app/images/result/sprite'));
}

function build() {
  return src([
    'app/**/*.html',
    'app/css/style.min.css',
    'app/images/result/**/*.*',
    'app/js/main.min.js',
    'app/fonts/*.woff',
    'app/fonts/*.woff2',
    'app/favicon.webp'
  ], { base: 'app' })
    .pipe(dest('dist'));
}

function cleanDist() {
  return del('dist');
}

function watching() {
  browserSync.init({
    server: {
      baseDir: 'app/'
    },
    notify: false
  });
  watch(['app/scss/**/*.scss'], styles);
  watch(['app/images/src'], images);
  watch(['app/fonts/src'], fonts);
  watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);
  watch(['app/*.html']).on('change', browserSync.reload);
  watch(['./src/**/*.html'], htmlInclude);
  watch(['app/images/ico/**.svg'], svgSprites);
}

exports.styles = styles;
exports.scripts = scripts;
exports.watching = watching;
exports.images = images;
exports.fonts = fonts;
exports.cleanDist = cleanDist;
exports.build = series(cleanDist, images, build);

exports.default = parallel(styles, htmlInclude, scripts, svgSprites, watching);