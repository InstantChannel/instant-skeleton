// Generated by LiveScript 1.3.0
(function(){
  var gulp, del, gulpNodemon, gulpUtil, gulpLivescript, gulpStylus, nib, gulpJade, gulpWebpack, gulpWatch, gulpLivereload, isProduction, defaultTasks;
  gulp = require('gulp');
  del = require('del');
  gulpNodemon = require('gulp-nodemon');
  gulpUtil = require('gulp-util');
  gulpLivescript = require('gulp-livescript');
  gulpStylus = require('gulp-stylus');
  nib = require('nib');
  gulpJade = require('gulp-jade');
  gulpWebpack = require('gulp-webpack');
  gulpWatch = require('gulp-watch');
  gulpLivereload = require('gulp-livereload');
  isProduction = process.env.NODE_ENV === 'production';
  gulp.task('build:stylus', function(){
    return gulp.src('./client/stylus/master.styl').pipe(gulpStylus({
      use: nib(),
      compress: true
    })).pipe(gulp.dest('./public'));
  });
  gulp.task('build:js', function(){
    return gulp.src('./{client,shared,server}/*.ls').pipe(gulpLivescript({
      bare: true
    })).pipe(gulp.dest('./build'));
  });
  gulp.task('build', ['build:js', 'build:stylus']);
  gulp.task('pack', ['build:js'], function(){
    return gulp.src('./build/{client,shared}/*.js').pipe(gulpWebpack()).pipe(gulp.dest('./public'));
  });
  gulp.task('watch', function(){
    gulp.watch('./{client,shared,server}/*.ls', ['build:js']);
    gulp.watch('./client/stylus/*.styl', ['build:stylus']);
    return gulpLivereload.listen();
  });
  gulp.task('clean', function(cb){
    return del(['./build/**'], cb);
  });
  gulp.task('develop', ['build', 'watch'], function(){
    return gulpNodemon({
      script: './build/server/main.js',
      nodeArgs: '--harmony'
    });
  });
  defaultTasks = ['build', 'pack'];
  if (!isProduction) {
    defaultTasks.push('develop');
  }
  gulp.task('default', defaultTasks);
}).call(this);