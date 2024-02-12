const webpackMerge = require('webpack-merge');
const defaultConfig = require('./node_modules/@angular/cli/models/webpack-configs');
const extraConfig = require('./webpack.extra');

module.exports = (env, argv) => {
  const config = defaultConfig(env, argv);
  return webpackMerge(config, extraConfig);
};
