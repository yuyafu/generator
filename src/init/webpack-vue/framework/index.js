'use strict'
var FsUtil = require('../../../util/fsUtil')
const Constant = require('../../../util/constant')
var path = require('path')
var vfs = new FsUtil()

const Framework = {
	handler:function(config){
		let dest = `${config.appDir}/${config.appName}`
		vfs.copyDir(`${config.basePath}/webpack-vue/framework/template`,dest)
		let cfg = {}
		for(let attr in config){
			if(attr === 'plugins' || attr === 'basePath' || attr === 'projectName') continue
			cfg[attr] = config[attr]
		}
		vfs.writeFile(JSON.stringify(cfg,null,'  '),`${dest}/${Constant.name}.json`)
		vfs.writeFile(`{
  "name": "${config.appName}",
  "keyword": [],
  "scripts": {
    "start": "node server.js",
    "lib": "webpack --config ddl.config.js",
    "build": "webpack --env=prod"
  },
  "dependencies": {
    "babel-polyfill": "~6.3.14",
    "classnames": "^2.2.5",
    "history": "~1.17.0",
    "reqwest": "^1.1.6 ",
    "vue": "^2.0.0-rc.7",
    "vuex": "^2.0.0-rc.6"
  },
  "devDependencies": {
    "autoprefixer-loader": "^3.2.0",
    "babel-core": "~6.7.6",
    "babel-eslint": "~6.0.2",
    "babel-plugin-transform-runtime": "^6.15.0",
    "babel-preset-es2015": "^6.14.0",
    "babel-runtime": "^6.11.6",
    "babel-loader": "~6.2.4",
    "babel-polyfill": "^6.0.0",
    "babel-preset-es2015": "~6.6.0",
    "babel-preset-stage-0": "~6.5.0",
    "css-loader": "~0.23.1",
    "eslint": "~2.7.0",
    "extract-text-webpack-plugin": "~1.0.1",
    "file-loader": "^0.9.0",
    "html-webpack-plugin": "^2.22.0",
    "less": "~2.6.1",
    "less-loader": "~2.2.3",
    "minimist": "^1.2.0",
    "node-sass": "^3.8.0",
    "open": "0.0.5",
    "sass-loader": "^4.0.0",
    "style-loader": "~0.13.1",
    "transfer-webpack-plugin": "^0.1.4",
    "url-loader": "^0.5.7",
    "vue-hot-reload-api": "^1.3.3",
    "vue-html-loader": "^1.2.3",
    "vue-loader": "^9.5.0",
    "vue-style-loader": "^1.0.0",
    "webpack": "~1.12.14",
    "webpack-dev-server": "~1.11.0"
  }
}

		`,`${dest}/package.json`)
	}
}


module.exports = Framework