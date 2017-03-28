'use strict'
const co = require('co')
const Prompt= require('../../util/prompt')
const path = require('path')
const chalk = require('chalk')
const log = require('../util/log')
const Exec = require('../init/exec')
// const error = (content)=>{
//    process.stderr.write(chalk.red.bold.underline(content))
// }
// const success = (content)=>{
//    process.stderr.write(chalk.bgGreen.white(content))
// }

const webpackReact = require('../init/webpack-react')
const webpackVue = require('../init/webpack-vue')
const FsUtil = require('../util/fsUtil')
const Constant = require('../util/constant')





module.exports = (module,name) => {
   let config = ''
   try{
      config = Object.assign({},new FsUtil().readFileRecursive(process.cwd(),`${Constant.name}.json`),{plugins:[],basePath:path.resolve(__dirname,'../init/')})
   }catch(e){
      log.error(e)
      process.exit(1)
   }
   config.opr = 'add'
   try{
      if(config.toolName === 'webpack' && config.mvvmName === 'react'){
         if(module === 'page'){
            config.projectName = name
            config.plugins.push(webpackReact.Project)
            if(config.router){
               config.plugins.push(webpackReact.Router)
            }
            webpackReact.handler(config)
         }
      }else if(config.toolName === 'webpack' && config.mvvmName === 'vue'){
         if(module === 'page'){
            config.projectName = name
            config.plugins.push(webpackVue.Project)
            // if(config.router){
            //    config.plugins.push(webpackReact.Router)
            // }
            webpackVue.handler(config)
         }
      }
   }catch(e){
      log.error(e)
      process.exit(1)
   }
   log.success(`add ${module} ${name} successfully!!!`)
   process.exit()
 // co(function *() {

 // })
}