'use strict'

var fs = require('fs')
var path = require('path')
var log = require('./log')
const Exec = require('../../src/init/exec');
var exec = require('child_process').exec

const charset = 'utf-8'
module.exports = class FileUtil{
	constructor(){
		this.listeners = [(name,type)=>{
			if(type === 1){
				log.info(`create FILE     【${name}】`)
			}else{
				log.info(`create DIRECTORY【${name}】`)
			}
		}]
	}
	onCreate(cb){
		this.listeners.push(cb)
	}
	copyDir(srcDir,tarDir){
		let _this = this
		if(!fs.existsSync(srcDir)){
			let msg = `${srcDir} is not exists!`
			throw new Error(msg)
		}
		if(fs.existsSync(tarDir)){
			fs.chmodSync(tarDir, parseInt('777', 8))
  			fs.rmdir(tarDir)
		}
		let state = fs.statSync(srcDir)
		if(!state.isDirectory()){
			let msg = `${srcDir} is not directory!`
			throw new Error(msg)
		}
		fs.mkdirSync(tarDir)
		this.listeners.forEach((listener)=>{
			listener(tarDir,0)
		})
		let files = fs.readdirSync(srcDir)
		files.forEach((f)=>{
			if(f === '.DS_Store') return
			let srcpath = path.join(srcDir,f)
			,tarpath = path.join(tarDir,f)
			let srcState = fs.statSync(srcpath)
			if(srcState.isDirectory()){
				this.copyDir(srcpath,tarpath)
			}else{
				this.copyFile(srcpath,tarpath)
			}
		})
	}
	copyFile(src,tar){
		if(!fs.existsSync(src)){
			let msg = `${src} is not exists!`
			throw new Error(msg)
		}
		if(fs.existsSync(tar)){
			fs.chmodSync(tar, parseInt('777', 8))
  			fs.unlinkSync(tar)
		}
		fs.writeFileSync(tar,fs.readFileSync(src))
		// fs.createReadStream(src)
		// .pipe(fs.createWriteStream(tar))
		this.listeners.forEach((listener)=>{
			listener(tar,1)
		})
	}
	writeFile(content,tar){
		if(fs.existsSync(tar)){
			fs.chmodSync(tar, parseInt('777', 8))
  			fs.unlinkSync(tar)
		}
		fs.writeFileSync(tar,content)
		this.listeners.forEach((listener)=>{
			listener(tar,1)
		})
	}
	tryWriteFile(content,tar){
		if(fs.existsSync(tar)){
			return 
		}
		fs.writeFileSync(tar,content)
		this.listeners.forEach((listener)=>{
			listener(tar,1)
		})
	}
	readFileRecursive(path,name){
		let filename = path+'/'+name
		if(!fs.existsSync(filename)){
			let npath = path.substr(0,path.lastIndexOf('/'))
			if(!npath){
				let msg = 'can\'t find '+name
				throw new Error(msg)
			}
			return this.readFileRecursive(npath,name)
		}
		let content = fs.readFileSync(filename)
		return JSON.parse(content)
	}
  copy(srcDir,tarDir){
    let _this = this;
    if(!fs.existsSync(srcDir)){
      let msg = `${srcDir} is not exists!`
      throw new Error(msg)
    }
    if(fs.existsSync(tarDir)){
      fs.chmodSync(tarDir, parseInt('777', 8))
      fs.rmdir(tarDir)
    }
    fs.mkdirSync(tarDir)
    this.listeners.forEach((listener)=>{
      listener(tarDir,0)
  })
    console.log('exec copy', srcDir, tarDir);
    let cmdStr = `cp -a -i ${srcDir}/* ${tarDir}`;
   /* exec(cmdStr, (error, stdout, stderr) => {
      if (error) {
        console.log('path',error)
        process.exit()
      }
      log.success('\n √ 文件copy成功')
    process.exit()
  })*/
    return Exec(cmdStr,null,{
      reserve:true,
			log: true
    })
  }
}