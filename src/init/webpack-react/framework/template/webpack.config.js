var args = require('minimist')(process.argv.slice(2))

var env = args.env || 'dev'


var augus = args._
var port
if(augus.length == 1){
	if(!isNaN(augus[0])){
		port = augus[0]
	}
}else if(augus.length == 2){
	port = augus[1]
}

var config = {
  dev:require('./config/webpack.dev')(port),
  prod:require('./config/webpack.prod')(env)
}
module.exports = config[env]