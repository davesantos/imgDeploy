var gulp = require('gulp'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    imageResize = require('gulp-image-resize'),
    newer = require('gulp-newer'),
    rename = require('gulp-rename');

var svgmin = require('gulp-svgmin'),
    svgstore = require('gulp-svgstore');

var img = {
  src: 'photos/*.{jpg,jpeg,png}',
  dest: 'deploy',
  width: 1080
};

var svg = {
  src: 'svg/*.svg',
  dest: 'deploy'
}

gulp.task('clean', function(cb) {
  del([img.dest], cb);
});

gulp.task('optimize', function(){
  gulp.src(img.src)
    .pipe(newer(img.dest))
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest(img.dest));
});


gulp.task('resize', function () {
  gulp.src(img.src)
    .pipe(newer(img.dest))
      .pipe(imageResize({
        width : img.width,
        crop : false,
        upscale : false
      }))
      .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
      .pipe(rename({
        suffix: "_" + img.width.toString()
      }))
      .pipe(gulp.dest(img.dest));
});

gulp.task('svg', function(){
  return gulp.src(svg.src)
  .pipe(svgmin())
  .pipe(gulp.dest('svg'));
});

gulp.task('svgstore', function () {
  return gulp.src(svg.src)
      .pipe(svgmin())
      .pipe(svgstore())
      .pipe(gulp.dest(svg.dest));
});

gulp.task('default', ['clean','optimize']);