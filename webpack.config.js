const path = require('path');

module.exports = {
  devtool: '#source-map',
  entry: './demo/src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'demo/dist'),
  },
  devServer: {
    contentBase: path.join(__dirname, 'demo/dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};
