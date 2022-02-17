const path = require('path');

module.exports = {
  target: 'node',
  entry: './build/index.js', // make sure this matches the main root of your code 
  output: {
    path: path.join(__dirname, 'bundle'), // this can be any path and directory you want
    filename: 'index.js',
    libraryTarget: 'commonjs',
  },
  optimization: {
    minimize: true, // enabling this reduces file size and readability
  },
};