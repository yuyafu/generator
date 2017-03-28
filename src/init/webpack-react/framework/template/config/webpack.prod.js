
var path = require('path');
var baseConfigFn = require('./webpack.base');
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var TransferWebpackPlugin = require('transfer-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin')
var webpack = require('webpack')
var util = require('./util');

var UtilPlugin = require('./utilPlugin')




function generateConfig(){
	var baseConfig = baseConfigFn()
	var pages = util.getPages(null,false,'prod')
	var config = Object.assign({},baseConfig,{
		entry: pages.entries,
		output: {
			path: 'build',
			// publicPath: '//g.alicdn.com/***/0.0.2/',
			publicPath:'../',
			filename: '[name].js',
			chunkFilename: '[name].[chunkhash].js'  //chunkhash
		},
		plugins: baseConfig.plugins.concat([
			new ExtractTextPlugin('[name].bundle.css', {
		      allChunks: true
		    }),
			new webpack.optimize.UglifyJsPlugin({
		      compress: {
		        unused: true,
		        dead_code: true,
		        warnings: false
		      },
		      mangle: {
		        except: ['$', 'exports', 'require']
		      },
		      output: {
		        ascii_only: true
		      }
		    }),
			new webpack.DefinePlugin({
			  'process.env': {
			    'NODE_ENV': JSON.stringify('production'),
			    'CDN':JSON.stringify('./')
			  }
			}),
			new UtilPlugin({
				base:path.resolve(__dirname,'../'),
				rm:['build','demo'],
				copy:[
					{
						from:'build',
						to:'demo'
					}
				]
			})
		],pages.plugins)
	})
	config.module.loaders = [{
		test: /\.less$/,
		loader: ExtractTextPlugin.extract('style', 'css-loader!autoprefixer-loader!less-loader')
	},{
		test: /\.scss$/,   
		loader: ExtractTextPlugin.extract('style', 'css-loader!autoprefixer-loader!sass-loader')
	},{
		test: /\.css$/,   
		loader: ExtractTextPlugin.extract('style', 'css-loader')
	}].concat(util.getLoaders())
	return config
}

module.exports = function buildConfig(env){
	return env === 'dev' ? {} : generateConfig()
}