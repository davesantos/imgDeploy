'use strict';

var gulp = require('gulp');
var del = require('del');
var imagemin = require('gulp-imagemin');
var imageResize = require('gulp-image-resize');
var newer = require('gulp-newer');
var rename = require('gulp-rename');
var svgstore = require('gulp-svgstore');

var imgFiles = [
  'source/*.{jpg,jpeg,png}'
]

var svgFiles = [
  'svg/*.svg'
]

var img = {
  dest: 'dist',
  width: 1080
};

var svg = {
  src: 'svg/*.svg',
  dest: 'dist'
}


gulp.task('clean', gulp.series(deleteFiles));

function deleteFiles(done) {
  return del([img.dest], done);
}

gulp.task('image', function(){

 var stream = gulp.src(imgFiles)
  .pipe(imagemin({
    verbose: true
  }))
  .pipe(gulp.dest(img.dest));
  return stream;

});

gulp.task('image:web', function(){
  var stream = gulp.src(imgFiles)
    .pipe(newer(img.dest))
    .pipe(imagemin({
      verbose: true,
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest(img.dest));
  return stream;
})


gulp.task('resize', function(){

  var stream = gulp.src(imgFiles)
    .pipe(newer(img.dest))
    .pipe(imageResize({
      width: img.width,
      crop: false,
      upscale: false
    }))
    .pipe(imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    }))
    .pipe(rename({
      suffix: "_" + img.width.toString()
    }))
    .pipe(gulp.dest(img.dest));
  return stream;

});

gulp.task('svg', function() {
  var stream = gulp.src(svgFiles)
    .pipe(imagemin())
    .pipe(gulp.dest(svg.dest));
  return stream;
});

gulp.task('svgstore', function() {
  var stream = gulp.src(svgFiles)
    .pipe(imagemin())
    .pipe(svgstore())
    .pipe(gulp.dest(svg.dest));
  return stream;
});

gulp.task('travis', gulp.series(gulp.parallel('svg','svgstore','image','clean', 'resize'), function(done){
  process.exit(0);
  done();
}));

function processExit() {
  process.exit(0);
  done()
}


gulp.task('default', gulp.series('clean', gulp.parallel('svg', 'image')));