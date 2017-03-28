'use strict'



var exec = require('child_process').exec

module.exports = (cmd,option,config)=>{
console.log('cmd', cmd, option, config);
	return new Promise((resolve,reject)=>{
		let ps = exec(cmd,option)
		,buffer = ''
		,errorFlag = false;
		ps.stdout.on('data',(data)=>{
      console.log('promise', data);
			config.log && process.stdout.write(data)
			config.reserve && (buffer += data)
		})
		ps.stderr.on('data',(data)=>{
			if(data.indexOf('npm ERR!') >= 0){
				errorFlag = true
			}
			config.log && process.stdout.write(data)
			config.reserve && (buffer += data)
		})
		ps.on('exit',(data)=>{
			if(errorFlag){
				resolve()
			}else{
				resolve(buffer ? buffer :true)
			}
			
		})
		ps.on('error',(data)=>{
			resolve()
		})
	})
}