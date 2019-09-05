'use strict';

import gulp from 'gulp';
import del from 'del';
import imagemin from 'gulp-imagemin';
import imageResize from 'gulp-image-resize';
import newer from 'gulp-newer';
import rename from 'gulp-rename';
import svgstore from 'gulp-svgstore';

const imgFiles = [
  'src/**/*.{jpg,jpeg,png}'
]

const svgFiles = [
  'src/**/*.svg'
]

const img = {
  dist: 'dist',
  width: 1080
};

const svg = {
  src: 'svg/*.svg',
  dist: 'dist'
}

gulp.task('clean', gulp.series(deleteFiles));

function deleteFiles(done) {
  return del([img.dist], done);
}

gulp.task('image', () => {

 const stream = gulp.src(imgFiles)
  .pipe(imagemin({
    verbose: true
  }))
  .pipe(gulp.dest(img.dist));
  return stream;

});

gulp.task('image:web', () => {
  const stream = gulp.src(imgFiles)
    // .pipe(newer(img.dist))
    .pipe(imagemin({
      verbose: true,
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest(img.dist));
  return stream;
})

gulp.task('resize', () => {
  const stream = gulp.src(imgFiles)
    .pipe(newer(img.dist))
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
    .pipe(gulp.dest(img.dist));
  return stream;
});

gulp.task('svg', () => {
  const stream = gulp.src(svgFiles)
    .pipe(imagemin({
      svgoPlugins: [{removeViewBox: true}]
    }))
    .pipe(gulp.dest(svg.dist));
  return stream;
});

gulp.task('svgstore', () => {
  const stream = gulp.src(svgFiles)
    .pipe(imagemin())
    .pipe(svgstore())
    .pipe(gulp.dest(svg.dist));
  return stream;
});

gulp.task('travis', gulp.series(gulp.parallel('svg','svgstore','image','clean', 'resize'), () => {
  return process.exit(0);
}));

gulp.task('default', gulp.series('clean', gulp.parallel('svg', 'image')));
