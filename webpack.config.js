const path = require('path');

module.exports = {
  entry: './demo/src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'demo/dist'),
  },
};
