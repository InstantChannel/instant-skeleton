
require! {
  gulp
  dotenv
  \del
  \open
  \gulp-jade
  \gulp-livescript
  \gulp-nodemon
  \gulp-shell
  \gulp-util
  \gulp-watch
  \webpack

  './package.json': config
  './webpack.config.js': wp-config

  './server/App': App
  'webpack-dev-server': WebpackDevServer
}

dotenv.load!

const env       = process.env.NODE_ENV or \development
const port      = parse-int process.env.npm_package_config_node_port
const dev-port  = process.env.npm_package_config_dev_port
const subdomain = process.env.npm_package_config_subdomain

const prod = env is \production

const compiler = webpack wp-config # use code caching


# build transformations
# ---------------------
gulp.task \build:primus (cb) ->
  const app = new App 31337
  <- app.start
  app # save primus client from koa config
    ..primus.save './public/vendor/primus.js'
    ..stop cb

gulp.task \build:server ->
  gulp.src ['./{shared,server}/**/*.ls']
    .pipe gulp-livescript {+bare, -header} # strip
    .pipe gulp.dest './build'

gulp.task \build:client run-compiler # build client app bundle


# watching
# --------
gulp.task \webpack:dev-server (cb) ->
  #return cb! # to skip
  const dev-server = new WebpackDevServer compiler, {
    quiet: prod
    #+hot
    #+debug
    #+inline
    devtool: \sourcemap
    #+no-info
    #watch-delay:  100ms
    public-path:  "http://#subdomain:#dev-port/builds/"
    content-base: "http://#subdomain:#port"
  }
  dev-server.listen dev-port, subdomain, (err) ->
    if err then throw new gulp-util.PluginError "webpack-dev-server: #err"
    cb!

gulp.task \watch ->
  gulp.watch ['./server/**/*.ls' './shared/**/*.ls'] [\build:server]
  gulp.watch ['./shared/**/*.ls' './client/**/*'] [\build:client]


# cleanup
# -------
gulp.task \stop (gulp-shell.task 'pm2 stop processes.json')
gulp.task \clean (cb) -> del ['./build/*' './public/builds/*'] cb


# env tasks
# ---------
gulp.task \development <[watch webpack:dev-server ]> ->
  gulp-nodemon {script:config.main, ext:'ls jade', ignore:<[node_modules client]>, node-args:'--harmony'}
    .once \start ->
      <- set-timeout _, 1250ms # wait a bit longer for server to fully boot
      open "http://#subdomain:#port"
    .on \restart ->
      <- set-timeout _, 1500ms # FIXME faster server restart
      <- run-compiler
gulp.task \production (gulp-shell.task 'pm2 start processes.json')


# main
# ----
default-tasks = <[build:server build:primus build:client ]>
  ..push env
gulp.task \default default-tasks


function run-compiler cb
  (err, stats) <- compiler.run
  if err then throw new gulp-util.PluginError "webpack-dev-server: #err"
  cb!

# vim:fdm=marker
