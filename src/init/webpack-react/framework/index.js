'use strict'
var FsUtil = require('../../../util/fsUtil')
const Constant = require('../../../util/constant')
const co = require('co')
var path = require('path')
var vfs = new FsUtil()

const Framework = {
	handler:function(config) {
    co(function*() {
      let dest = `${config.appDir}/${config.appName}`
      vfs.copyDir(`${config.basePath}/webpack-react/framework/template`,dest)
      //用来copy，使用linux命令
      //let cpSuc = yield vfs.copy(`${config.basePath}/webpack-react/framework/template`,dest);
      if(!cpSuc || /(\w+\.)+\d/.test(cpSuc) < 0){
        process.stdout.write('\n')
        log.error('copy 失败');
        process.exit(1)
      }
      let cfg = {}
      for(let attr in config){
        if(attr === 'plugins' || attr === 'basePath' || attr === 'projectName') continue
        cfg[attr] = config[attr]
      }
      console.log(cfg);
      vfs.writeFile(JSON.stringify(cfg,null,'  '),`${dest}/${Constant.name}.json`)

      vfs.writeFile(`{
  "name": "${config.appName}",
  "keyword": [
  ],
  "scripts": {
    "start": "node server.js",
    "lib": "webpack --config ddl.config.js",
    "build": "webpack --env=prod"
  },
  "dependencies": {
    "@alife/next": "^0.1.81",
    "babel-polyfill": "~6.3.14",
    "classnames": "^2.2.5",
    "history": "~1.17.0",
    "react-addons-transition-group": "^15.3.0",
    "react-dom": "^15.3.0",
    "react-redux": "^4.4.5",
    "redux": "^3.5.2",
    "react":"^15.3.0",
    "reqwest": "^1.1.6 "
  },
  "devDependencies": {
    "autoprefixer-loader": "^3.2.0",
    "babel-core": "~6.7.6",
    "babel-eslint": "~6.0.2",
    "babel-loader": "~6.2.4",
    "babel-preset-es2015": "~6.6.0",
    "babel-preset-react": "~6.5.0",
    "babel-preset-stage-0": "~6.5.0",
    "css-loader": "~0.23.1",
    "eslint": "~2.7.0",
    "eslint-plugin-react": "~5.0.1",
    "extract-text-webpack-plugin": "~1.0.1",
    "file-loader": "^0.9.0",
    "html-webpack-plugin": "^2.22.0",
    "less": "~2.6.1",
    "less-loader": "~2.2.3",
    "minimist": "^1.2.0",
    "node-sass": "^3.8.0",
    "open": "0.0.5",
    "react-hot-loader": "^1.3.0",
    "sass-loader": "^4.0.0",
    "style-loader": "~0.13.1",
    "transfer-webpack-plugin": "^0.1.4",
    "url-loader": "^0.5.7",
    "webpack": "~1.12.14",
    "webpack-dev-server": "~1.11.0"
  }
}
		`,`${dest}/package.json`)
      return 'ok';
    });
  }
}


module.exports = Framework