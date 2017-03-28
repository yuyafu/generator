var args = require('minimist')(process.argv.slice(2))

function list_equal(src,tar){
	if(src.length !== tar.length) return false
	var libMap = {}
	src.forEach(function(name){
		libMap[name] = true
	})
	for(var i = 0; i < tar.length; i++){
		if(!libMap[tar[i]]) return false
	}
	return true
}

var exec = require('child_process').exec

var util = require('./config/util');
var fs =require('fs')
var path = require('path')
var packagePath = path.resolve(__dirname,'./illidan.json')
var illidanCfg = JSON.parse(fs.readFileSync(packagePath))
var vendors = util.getVendors()
if(!illidanCfg.dependencies || !list_equal(illidanCfg.dependencies,vendors)){
	console.log('run `webpack --config ddl.config.js`......')
	var ps = exec('webpack --config ddl.config.js')
	,buffer = ''
	ps.stdout.on('data',function(data){
		buffer += data
		process.stdout.write(data)
	})
	ps.stderr.on('data',function(data){
		buffer += data
		process.stdout.write(data)
	})
	ps.on('exit',()=>{
		if(buffer.indexOf('ERROR in dll lib') >= 0){
			console.error('=====error occured,stop start server!!!=====')
			return 
		}else{
			illidanCfg.dependencies = vendors
			fs.writeFileAsync(packagePath,JSON.stringify(illidanCfg,null,'  '))
		}
		var serverPs = exec('node server.js')
		serverPs.stdout.on('data',function(data){
			process.stdout.write(data)
		})
		serverPs.stderr.on('data',function(data){
			process.stdout.write(data)
		})
	})
	return 
}


var defailtHtmlName
var augus = args._
if(augus.length >= 1){
	if(isNaN(augus)){
		defailtHtmlName = augus[0]
	}
}
var config = require("./webpack.config");
var open = require("open");
var webpack = require("webpack");
var webpackDevServer = require("webpack-dev-server"); 
var port = config.devServer.port
var host = "http://localhost:"+port+config.devServer.publicPath;



for(var name in config.entry){
	// config.entry[name].unshift("webpack-dev-server/client?"+host, "webpack/hot/only-dev-server");  需要自己刷新
	config.entry[name].unshift("webpack-dev-server/client?"+host, "webpack/hot/dev-server");
	if(!defailtHtmlName) defailtHtmlName = name.substr(0,name.indexOf('/'))
}
host = host + defailtHtmlName+'/index.html'
var compiler = webpack(config);
// process.exit(1)
var server = new webpackDevServer(compiler, config.devServer);
server.listen(port,()=>{
	console.log("listening on "+host+"....");
	open(host,function(err){

	})
});