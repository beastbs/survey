const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: "./src/app.js",
  output: {
    filename: "bundle.[chunkhash].js",
    path: path.resolve(__dirname, "public"),
  },
  devServer: {
    port: 3000,
  },
  plugins: [
	new HTMLWebpackPlugin({template: "./src/index.html"}),
	new CleanWebpackPlugin(),
	new MiniCssExtractPlugin({
		filename: "styles.[chunkhash].css"
	})
],
  module: {
	rules: [
	  {
		 test: /\.css$/i,
		 use: [MiniCssExtractPlugin.loader, "css-loader"],
	  },
	],
 },
};
