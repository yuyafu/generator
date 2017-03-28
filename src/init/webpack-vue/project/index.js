'use strict'
var FsUtil = require('../../../util/fsUtil')
var path = require('path')
var vfs = new FsUtil()

const Project = {
	handler:function(config){
		vfs.copyDir(`${config.basePath}/webpack-vue/project/template`,`${config.appDir}/${config.appName}/src/pages/${config.projectName}`)
	},
	generate:function(name){
		vfs.copyDir(`${config.basePath}/webpack-vue/project/template`,`${process.cwd()}/${name}`)
	}
}


module.exports = Project