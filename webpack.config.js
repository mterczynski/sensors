module.exports = {
  mode: 'development',
  entry: './app.ts',
  output: {
    filename: 'bundle.js'
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['.ts', '.tsx', '.js'] // note if using webpack 1 you'd also need a '' in the array as well
  },
  module: {
    rules:[
      { test: /\.tsx?$/, loader: 'ts-loader' }
    ]
  }
}