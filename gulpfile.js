var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');


gulp.task(
  'copy',
  gulp.series(
    function copyHTML() {
      return gulp
        .src(['src/templates/**/*'])
        .pipe(gulp.dest('./dist'))
        .on('end', function() {
          browserSync.reload();
        });
    },
    function copyAssets() {
      return gulp
        .src(['src/images/**/*'], {
          base: 'src/'
        })
        .pipe(gulp.dest('./dist'))
        .on('end', function() {
          browserSync.reload();
        });
    }
  )
);

gulp.task(
  'scss',
  gulp.series(
    function compileCss() {
      return gulp
        .src('./src/scss/main.scss') // this is the source of for compilation
        .pipe(sass().on('error', sass.logError)) // compile SCSS to CSS and also tell us about a problem if happens
        .pipe(gulp.dest('./dist/css')) // destination of the resulting CSS
        .pipe(browserSync.stream()); // tell browsersync to reload CSS (injects compiled CSS)
    }
  )
);



gulp.task(
  'develop',
  gulp.series(
    gulp.parallel('copy', 'scss'),
    function startBrowsersync() {
      browserSync.init({
        server: {
          baseDir: './dist',
          serveStaticOptions: {
            extensions: ['html']
          }
        }
      });
      gulp.watch('./src/templates/**/*', gulp.series('copy'));
      gulp.watch('./src/images/**/*', gulp.series('copy'));
      gulp.watch('./src/scss/**/*', gulp.series('scss')); // watch for changes in SCSS
    }
  )
);

gulp.task('default', gulp.series('develop'));

