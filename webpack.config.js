const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "app.bundle.js",
    path: path.join(__dirname, "dist"),
    chunkFilename: "[name].bundle.js",
    publicPath: "./"
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.bundle\.js$/,
        use: "bundle-loader"
      },
      { enforce: "pre", test: /\.js$/, loader: "eslint-loader" },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          query: {
            presets: ["@babel/react"]
          }
        }
      },
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
      {
        test: /\.s[ac]ss$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.(otf|png|gif)$/,
        use: ["file-loader"]
      }
    ]
  },
  plugins: HtmlWebpackPluginTemplates(["index"]),
  optimization: {
    splitChunks: {
      chunks: "all"
    }
  },
  devServer: {
    contentBase: path.join(__dirname, "dist")
  }
};

function HtmlWebpackPluginTemplates(htmlPages) {
  return htmlPages.map(
    name =>
      new HtmlWebpackPlugin({
        filename: name + ".html",
        template: `public/${name}.html`
      })
  );
}
