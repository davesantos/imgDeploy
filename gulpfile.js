var gulp = require('gulp'),
    del = require('del'),
    imageResize = require('gulp-image-resize'),
    imagemin = require('gulp-imagemin'),
    newer = require('gulp-newer'),
    rename = require('gulp-rename'),
    svgstore = require('gulp-svgstore');

var img = {
  src: 'source/*.{jpg,jpeg,png}',
  dest: 'dist',
  width: 1080
};

var svg = {
  src: 'svg/*.svg',
  dest: 'dist'
}

gulp.task('clean', function(cb) {
  del([img.dest], cb);
});

gulp.task('image', function(){
  gulp.src(img.src)
    // .pipe(newer(img.dest))
    .pipe(imagemin({ verbose: true }))
    .pipe(gulp.dest(img.dest));
});

gulp.task('image:web', function(){
  gulp.src(img.src)
    .pipe(newer(img.dest))
    .pipe(imagemin({ verbose: true, optimizationLevel: 3, progressive: true, interlaced: true }))
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
  .pipe(imagemin())
  .pipe(gulp.dest(svg.dest));
});

gulp.task('svgstore', function () {
  return gulp.src(svg.src)
      .pipe(imagemin())
      .pipe(svgstore())
      .pipe(gulp.dest(svg.dest));
});

gulp.task('default', ['clean','svg', 'image']);