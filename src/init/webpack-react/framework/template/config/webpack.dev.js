
var path = require('path');
var baseConfigFn = require('./webpack.base');
var HtmlWebpackPlugin = require('html-webpack-plugin')
var webpack = require('webpack')



var util = require('./util');


module.exports = function(port){
	var baseConfig = baseConfigFn()
	var publicPath = '/';
	var pages = util.getPages(null,true)
	var config = Object.assign({},baseConfig,{
		entry: pages.entries,
		output: {
			path: path.join(__dirname,'../build'),
			publicPath: publicPath,
			filename: '[name].[hash].js',
			chunkFilename: '[name].[chunkhash].js'  //chunkhash
		},
		devServer:{
		    hot: true,
		    publicPath: publicPath,
		    contentBase:'./src/',
		    historyApiFallback:true,
		    noInfo:false,
		    port:port || 8088,
		    inline: true
		},
		plugins: baseConfig.plugins.concat([
			new webpack.HotModuleReplacementPlugin(),
			new webpack.NoErrorsPlugin(),
			new webpack.DefinePlugin({
			  'process.env': {
			    'NODE_ENV': JSON.stringify('development'),
			    'CDN':JSON.stringify('./')
			  }
			}),
			new webpack.SourceMapDevToolPlugin({}),
			new webpack.DllReferencePlugin({
	            context: path.resolve(__dirname,'../'),
	            manifest: require('../manifest.json'),
	        })
		],pages.plugins)
	})


	config.module.loaders = [{
	    test: /\.less$/,
	    loader: 'style-loader!css-loader!autoprefixer-loader!less-loader'
	},{
		test: /\.scss$/,   
		loader: 'style-loader!css-loader!autoprefixer-loader!sass-loader'
	},{
		test: /\.css$/,   
		loader: 'style-loader!css-loader'
	}].concat(util.getLoaders())
	return config

}



