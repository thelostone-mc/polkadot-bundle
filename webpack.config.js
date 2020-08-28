const path = require('path');

module.exports = {
  entry: {
    extension: './src/extension.js',
    utils:'./src/utils.js',
    core: './src/core.js',
    all: './src/index.js'
  },
  output: {
    filename: '[name].min.js',
    path: path.resolve(__dirname, 'polkadot'),
  },
};