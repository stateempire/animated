var local = {name: 'local', mode: 'development', devtool: 'source-map'};
var development = {name: 'development', mode: 'development'};
var staging = {name: 'staging', mode: 'production'};
var production = {name: 'master', mode: 'production'};

var env = {
  local: local,
  development: development,
  staging: staging,
  production: production,
  current: local
};

for (var i = 0; i < process.argv.length; i++) {
  var matched = process.argv[i].match(/^--env=([^ ]+)/);
  if (matched && env[matched[1]]) {
    env.current = env[matched[1]];
    break;
  }
}

module.exports = env;
