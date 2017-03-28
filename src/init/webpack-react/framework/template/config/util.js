'use strict';
var path = require('path')
var fs = require('fs')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var UtilFiles
var Util = {
	getLoaders :function (){
		return [
	      {
	        test: /\.jsx?$/,
	        exclude: /node_modules/,
	        loader:'react-hot!babel-loader'
	      },{
	        test:/\.(png|jpg|gif|ico|ttf|woff|woff2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
	        loader:'url-loader?limit=8192'
	      }
	    ]
	},
	getFileList:function (){
		if(UtilFiles) return UtilFiles
		var pageDir = path.resolve(__dirname,'../src/pages')
		if(!fs.existsSync(pageDir)){
			throw new Error("can't find pages directory.")
		}
		var files = fs.readdirSync(pageDir)
		if(!files || files.length === 0){
			throw new Error("can't find any page")
		}
		files = files.filter(function(f){
			return fs.existsSync(pageDir+'/'+f+'/app.js')
		})
		if(files.length === 0){
			throw new Error("can't find any page")
		}
		UtilFiles = files
		return files
	},
	getResolve:function (resolve){
		var resolve = Object.assign({
			util:'src/util',
			styles:'src/less',
			commons:'src/components',
			mixins:'src/mixins'
		},resolve)
		var files = Util.getFileList(),fname
		for(var i = 0 ; i < files.length; i++){
			fname = files[i]
			resolve[fname] = 'src/pages/'+fname
		}
		return resolve
	},
	getPages : function (lib,toArray,env){
		var files = Util.getFileList()
		var entries = {},fname,plugins = [],comChunks = ['vendor']
		env = env || 'dev'
		if(lib){
			for(var libname in lib){
				entries[libname] = lib[libname]
				if(libname !== 'vendor'){
					comChunks.push(libname)
				}
			}
		}
		for(var i = 0; i < files.length; i++){
			fname = files[i]
			if(toArray){
				entries[fname+'/app'] = ["./src/pages/"+fname+"/app.js"]
			}else{
				entries[fname+'/app'] = "./src/pages/"+fname+"/app.js"
			}
			let chunkArr = []
			plugins.push(new HtmlWebpackPlugin({
		      filename:fname+'/index.html',
		      template:'src/pages/'+fname+'/'+env+'.html',
		      inject:'body',
		      chunks:comChunks.concat([fname+'/app'])
		    }))
		}
		
		return {
			entries,
			plugins
		}
	},
	getVendors:function(){
		let packageCfg = JSON.parse(fs.readFileSync(path.resolve(__dirname,'../package.json')))
		,libList = []
		for(let lib in packageCfg.dependencies){
			libList.push(lib)
		}
		return libList
	},
	getDevLib:function(){
		return [
			'react-hot-loader',
			'url',
			'querystring',
			'babel-polyfill',
			'webpack-dev-server/node_modules/socket.io-client',
			'style-loader'
		]
	}
}
module.exports = Util
