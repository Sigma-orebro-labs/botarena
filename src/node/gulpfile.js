var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');

gulp.task('less', function () {
  gulp.src('public/less/bot-arena.less')
  .pipe(less({
    paths: [ path.join(__dirname, 'less', 'includes') ]
  }))
  .pipe(gulp.dest('public/css'));
});

gulp.task('watch', function() {
  gulp.watch('**/*.less', ['less']);
});

gulp.task('default', ['less', 'watch']);