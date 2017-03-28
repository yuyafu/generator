'use strict'
const co = require('co')
const Prompt= require('../../util/prompt')
const path = require('path')
const chalk = require('chalk')
const log = require('../util/log')
const Exec = require('./exec')


const webpackReact = require('./webpack-react')
const webpackVue = require('./webpack-vue')
function compareStr(tar,src){
   if(!tar) return false
   return src.substring(0,tar.length) === tar
}

function getAllName(str,arr){
   for(let name of arr){
      if(name.substring(0,str.length) === str){
         return name
      }
   }
}

function displayChoose(config){
   console.log(`===========config  info=============`)
   console.log(`App name                  :${config.appName}`)
   console.log(`Packaging Tool            :${config.toolName}`)
   console.log(`MVVM Framework            :${config.mvvmName}`)
   if(config.mvvmName === 'react'){
      console.log(`Choose add Router         :${config.router ? chalk.green('true') : chalk.red('false')}`)
      console.log(`Choose add Code Splitting :${config.split ? chalk.green('true') : chalk.red('false')}`)
      console.log(`Choose add immutable.js   :${config.immutable ? chalk.green('true') : chalk.red('false')}`)
   }
   console.log(`====================================`)
}

module.exports = () => {
 co(function *() {
   let config,isOk
   do{
      config = {plugins:[],basePath:path.resolve(__dirname),appDir:process.cwd(),toolName:'webpack'}
      // 分步接收用户输入的参数
      config.appName = yield Prompt.info(`Project Name: `)
      config.projectName = yield Prompt.info(`Page Name: `)
      // let toolName = yield Prompt.info(`Choose Packaging Tool:( ${chalk.bgWhite.black('webpack')} | ${chalk.bgWhite.black('gulp')} ) `)
      // while(!compareStr(toolName ,'webpack') && !compareStr(toolName ,'gulp')){
      //    log.error('You can only choose webpack or gulp')
      //    toolName = yield Prompt.info(`Choose Packaging Tool:( ${chalk.bgWhite.black('webpack')} | ${chalk.bgWhite.black('gulp')} ) `)
      // }
      // config.toolName = getAllName(toolName,['webpack','gulp'])
      let mvvmName = yield Prompt.info(`Choose MVVM Framework:( ${chalk.bgWhite.black('react')} | ${chalk.bgWhite.black('vue')} ) `)
      while(!compareStr(mvvmName,'react') && !compareStr(mvvmName,'vue')){
         log.error('You can only choose react or vue')
         mvvmName = yield Prompt.info(`Choose MVVM Framework:( ${chalk.bgWhite.black('react')} | ${chalk.bgWhite.black('vue')} ) `)
      }
      if(compareStr(mvvmName,'react')){
         config.mvvmName = 'react'
         config.plugins.push(webpackReact.Framework,webpackReact.Project)
         let router = yield Prompt.info(`Add redux-router:( ${chalk.bgWhite.black('y')} | ${chalk.bgWhite.black('n')} ) `)
         if(router.toLowerCase() === 'y'){
            config.router = true
            config.plugins.push(webpackReact.Router)
            let codeSplit = yield Prompt.info(`Add Code Splitting:( ${chalk.black('y')} | ${chalk.black('n')} ) `)
            if(codeSplit.toLowerCase() === 'y'){
               config.split = true
            }
         }
         let immutable = yield Prompt.info(`Add immutable.js:( ${chalk.black('y')} | ${chalk.black('n')} ) `)
         if(immutable.toLowerCase() === 'y'){
            config.immutable = true
         }
      }else{
         config.mvvmName = 'vue'
         config.plugins.push(webpackVue.Framework,webpackVue.Project)
         // let router = yield Prompt.info(`Add redux-router:( ${chalk.bgWhite.black('y')} | ${chalk.bgWhite.black('n')} ) `)
         // if(router.toLowerCase() === 'y'){
         //    config.router = true
         //    config.plugins.push(webpackReact.Router)
         //    let codeSplit = yield Prompt.info(`Add Code Splitting:( ${chalk.black('y')} | ${chalk.black('n')} ) `)
         //    if(codeSplit.toLowerCase() === 'y'){
         //       config.split = true
         //    }
         // }
         // let immutable = yield Prompt.info(`Add immutable.js:( ${chalk.black('y')} | ${chalk.black('n')} ) `)
         // if(immutable.toLowerCase() === 'y'){
         //    config.immutable = true
         // }
      }
      displayChoose(config)
      isOk = yield Prompt.info(`Confirmed your chooses :( ${chalk.bgWhite.black('y')} | ${chalk.bgWhite.black('n')} ) `)
      if(isOk.toLowerCase() === 'y'){
         break
      }
   }while(true)

   process.stdout.write('check that does tnpm had installed ... ')
   let content  = yield Exec('npm -version',null,{
      reserve:true
   })
   if(!content || /(\w+\.)+\d/.test(content) < 0){
      process.stdout.write('\n')
      log.error('check that you haven\'t install tnpm,please run '+chalk.black('sudo npm install -g tnpm --registry=http://registry.npm.alibaba-inc.com'))
      process.exit(1)
   }
   process.stdout.write(chalk.green('√\n'))
   try{
      if(config.mvvmName === 'react' && config.toolName === 'webpack'){
        
         webpackReact.handler(config)
      }else if(config.mvvmName === 'vue' && config.toolName === 'webpack'){
         webpackVue.handler(config)
      }
   }catch(e){
      log.error(e)
      process.exit(1)
   }
   let installFlg = yield Prompt.info(`tnpm install ？:( ${chalk.bgWhite.black('y')} | ${chalk.bgWhite.black('n')} ) `)
   if(installFlg.toLowerCase() === 'y'){
      let ret = yield Exec('tnpm i',{
         cwd:`${config.appDir}/${config.appName}`
      },{log:true})
      if(!ret){
         log.error('tnpm install error')
         process.exit(1)
      }
      log.success('tnpm install successfully!!')
   }
   log.success(`${config.appName} create successfully!!!`)
   
   process.exit()
 })
}