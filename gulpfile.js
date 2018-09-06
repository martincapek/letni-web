var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer');
var csso = require("gulp-csso");


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
        .src('./src/scss/main.scss') // zdrojový soubor SCSS
        .pipe(sourcemaps.init()) // inicializace source mapy
        .pipe(sass().on('error', sass.logError)) // zkompiluj SCSS do standardního CSS a případně oznam chyby
        .pipe(postcss([ autoprefixer() ])) // automaticky přidej vendor prefixy, pokud je třeba
        .pipe(csso()) // minifikace CSS
        .pipe(sourcemaps.write("./")) // ulož source mapu
        .pipe(gulp.dest('./dist/css')) // zapiš do cílového CSS
        .pipe(browserSync.stream()); // řekni Browser Syncu, aby načetl nové CSS a aktualizoval stránku v prohlížeči
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
      gulp.watch('./src/templates/**/*', gulp.series('copy')); // sleduj změny v HTML šablonách
      gulp.watch('./src/images/**/*', gulp.series('copy')); // sleduj změny ve složce obrázky
      gulp.watch('./src/scss/**/*', gulp.series('scss')); // sleduj změny v SCSS
    }
  )
);

gulp.task('default', gulp.series('develop'));

