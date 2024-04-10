const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: './src/index.js',

  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "build"),
    publicPath: '/'
  },

  mode: 'development',

  devtool: "source-map",

  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },

  // настройки локального сервера
  devServer: {
    static: path.resolve(__dirname, 'build'),
    host: "0.0.0.0",
    allowedHosts: 'all',
    compress: false,
    port: 3000,
    open: true,
    hot: true,
    historyApiFallback: true
  },
  
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          }
        }
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: 'ts-loader'
      },
      {
        test: /\.(le|c)ss$/,
        use: [
          // compiles Less to CSS
          "style-loader",
          "css-loader",
        ],
      }
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "index.html"),
    }),
  ],
};