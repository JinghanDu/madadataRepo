module.exports = {
  context: __dirname + "/index",
  entry: "./js/UnitDiv.js",
  
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



