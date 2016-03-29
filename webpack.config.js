module.exports = {
  context: __dirname + "/index",
  entry: "./js/UnitDiv.js",
  resolve: {
    extensions: ["", ".jsx", ".cjsx", ".coffee", ".js"],
    modulesDirectories: ["js", "node_modules"]
  },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  },
  output: {
    filename: "bundle.js",
    path: __dirname + "/index",
  },
}



