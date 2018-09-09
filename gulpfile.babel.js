'use strict';

import gulp from 'gulp';
import del from 'del';
import imagemin from 'gulp-imagemin';
import imageResize from 'gulp-image-resize';
import newer from 'gulp-newer';
import rename from 'gulp-rename';
import svgstore from 'gulp-svgstore';

const imgFiles = [
  'source/**/*.{jpg,jpeg,png}'
]

const svgFiles = [
  'source/**/*.svg'
]

const img = {
  dest: 'dist',
  width: 1080
};

const svg = {
  src: 'svg/*.svg',
  dest: 'dist'
}

gulp.task('clean', gulp.series(deleteFiles));

function deleteFiles(done) {
  return del([img.dest], done);
}

gulp.task('image', function(){

 const stream = gulp.src(imgFiles)
  .pipe(imagemin({
    verbose: true
  }))
  .pipe(gulp.dest(img.dest));
  return stream;

});

gulp.task('image:web', function(){
  const stream = gulp.src(imgFiles)
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
  const stream = gulp.src(imgFiles)
    .pipe(newer(img.dest))
    .pipe(imageResize({
      filter: "Catrom",
      imageMagick: true,
      noProfile: true,
      width: img.width
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
  const stream = gulp.src(svgFiles)
    .pipe(imagemin({
      svgoPlugins: [{removeViewBox: true}]
    }))
    .pipe(gulp.dest(svg.dest));
  return stream;
});

gulp.task('svgstore', function() {
  const stream = gulp.src(svgFiles)
    .pipe(imagemin())
    .pipe(svgstore())
    .pipe(gulp.dest(svg.dest));
  return stream;
});

gulp.task('travis', gulp.series(gulp.parallel('svg','svgstore','image','clean', 'resize'), function(){
  return process.exit(0);
}));

function processExit() {
  process.exit(0);
  done()
}

gulp.task('default', gulp.series('clean', gulp.parallel('svg', 'image')));