// Generated by LiveScript 1.3.0
(function(){
  var gulp, gulpShell, del, gulpNodemon, gulpUtil, gulpLivescript, gulpStylus, nib, gulpJade, gulpWebpack, gulpWatch, gulpLivereload, env, script, x$, defaultTasks;
  gulp = require('gulp');
  gulpShell = require('gulp-shell');
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
  env = process.env.NODE_ENV || 'development';
  gulp.task('build:stylus', function(){
    return gulp.src('./client/stylus/master.styl').pipe(gulpStylus({
      use: nib(),
      compress: true
    })).pipe(gulp.dest('./public'));
  });
  gulp.task('build:react', function(){
    return gulp.src('./shared/react/*.ls').pipe(gulpLivescript({
      bare: true
    })).pipe(gulp.dest('./build/shared/react'));
  });
  gulp.task('build:js', function(){
    return gulp.src('./{client,shared,server}/*.ls').pipe(gulpLivescript({
      bare: true
    })).pipe(gulp.dest('./build'));
  });
  gulp.task('build', ['build:js', 'build:stylus']);
  gulp.task('pack', ['build:js', 'build:react'], function(){
    return gulp.src('./build/{client,shared}/*.js').pipe(gulpWebpack()).pipe(gulp.dest('./public/builds'));
  });
  gulp.task('watch', function(){
    gulp.watch('./shared/react/*.ls', ['build:react']);
    gulp.watch('./{client,shared,server}/*.ls', ['build:js']);
    gulp.watch('./client/stylus/*.styl', ['build:stylus']);
    return gulpLivereload.listen();
  });
  gulp.task('stop', gulpShell.task('pm2 stop processes.json'));
  gulp.task('clean', function(cb){
    return del(['./build/**'], cb);
  });
  script = './build/server/main.js';
  gulp.task('development', ['build', 'watch'], function(){
    return gulpNodemon({
      script: script,
      nodeArgs: '--harmony'
    });
  });
  gulp.task('production', ['build'], gulpShell.task('pm2 start processes.json'));
  x$ = defaultTasks = ['build', 'pack'];
  x$.push(env);
  gulp.task('default', defaultTasks);
}).call(this);
