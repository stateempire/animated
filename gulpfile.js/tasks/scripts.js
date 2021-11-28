var gulp = require('gulp');
var webpack = require('webpack');
var wpStream = require('webpack-stream');
var gulpif = require('gulp-if');
var eslint = require('gulp-eslint');
var plumber = require('gulp-plumber');
var {paths, env, settings} = require('../setup.js');

var wpConfig = makeConfig();

function getSettings() {
  return `{${settings.app_settings}}`.replace(/@replace{([^{}]*)}/g, function(match, group1) {
    if (group1 in settings) {
      return settings[group1];
    }
    return match;
  });
}

function makeConfig() {
  var app_settings = getSettings();
  return {
    output: {
      filename: 'bundle.js',
    },
    plugins: [
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      }),
      new webpack.DefinePlugin({
        APP_SETTINGS: app_settings,
      }),
    ],
    devtool: env.current.devtool || false, // https://webpack.js.org/configuration/devtool/
    mode: env.current.mode,// https://webpack.js.org/concepts/mode/
    resolve: {
      alias: {
        Loader: `plugins/loaders/${settings.loader}`,
        Router: `setjs/router/${settings.routerName}-router`,
        LangHelper: (/languages:/.test(app_settings) ? 'setjs/kernel' : 'core') + '/lang-helper',
        Tests: `app/tests/${env.current.mode}`,
      },
      modules: [paths.src.scripts, 'node_modules'],
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
      ],
    }
  };
}

function lint() {
  return gulp.src(paths.src.scripts + '/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(gulpif(env.current.mode != env.local.mode, eslint.failAfterError()));
}

function compile() {
  return gulp.src(paths.src.scripts + '/main.js')
    .pipe(plumber())
    .pipe(wpStream(wpConfig, webpack))
    .pipe(gulp.dest(paths.dest.scripts));
}
exports.scripts = gulp.parallel(lint, compile);
exports.reloadConfig = function(cb) {
  wpConfig = makeConfig();
  cb();
}
