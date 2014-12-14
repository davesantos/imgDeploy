var gulp = require('gulp'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    imageResize = require('gulp-image-resize'),
    newer = require('gulp-newer'),
    rename = require('gulp-rename');

var imgSrc = 'photos/*.{jpg,jpeg,png}',
    imgDest = 'deploy',
    imgWidth = 1080;


gulp.task('clean', function(cb) {
  del([imgDest], cb);
});

gulp.task('optimize', function(){
  gulp.src(imgSrc)
    .pipe(newer(imgDest))
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest(imgDest));
});


gulp.task('resize', function () {
  gulp.src(imgSrc)
    .pipe(newer(imgDest))
      .pipe(imageResize({
        width : imgWidth,
        crop : false,
        upscale : false
      }))
      .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
      .pipe(rename({
        suffix: "_" + imgWidth.toString()
      }))
      .pipe(gulp.dest(imgDest));
});

gulp.task('default', ['optimize']);