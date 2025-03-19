const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/main.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  mode: "development",
  devServer: {
    static: path.resolve(__dirname, "dist"),
    port: 3000,
    open: true,
    hot: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      minify: false,
    }),
    new MiniCssExtractPlugin({ filename: "styles.css" }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "src/img", to: "img" },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.sass$/,
        use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            "sass-loader",
        ],
      },
      {
        test: /\.(png|jpe?g|gif|webp)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash].[ext]',
              outputPath: 'img/',
            },
          },
        ],
      },
      {
        test: /\.svg$/i,
        type: "asset/resource",
        generator: {
          filename: "img/icons/[name][ext]",
        },
      },
    ],
  },
};
