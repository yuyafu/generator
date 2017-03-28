var path = require('path');
var baseDir = path.resolve(__dirname,'../');
var util = require('./util');

var webpack = require('webpack')

module.exports = function(){
  var baseConfig = {
    context: baseDir,
    module: {
    },
    resolve:{
      root:baseDir,
      extensions: ['', '.js','.vue'],
      alias:util.getResolve()
    },
    plugins: [
      new webpack.optimize.CommonsChunkPlugin({
        name: "vendor",
        minChunks: Infinity
      })
    ]
  };
  return baseConfig
}

