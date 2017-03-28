'use strict'
var FsUtil = require('../../../util/fsUtil')
var path = require('path')
var vfs = new FsUtil()

function generateRoute(split,name){
	if(split){
		return `'use strict';
export default {
  childRoutes:[
    {
      path:'/',
      getComponents(location, callback) {
        require.ensure([], function (require) {
          callback(null, require('${name}/layout/').default)
        },'layout')
      },
      onEnter(nextState, replace, callback){
        callback()
      },
      onChange(nextState, replace, callback){
        callback()
      },
      getIndexRoute(location, callback) {
        require.ensure([], function (require) {
          callback(null, {
            component: require('${name}/containers/dashboard/').default
          })
        })
      },
      getChildRoutes(location, callback) {
        require.ensure([], function (require) {
          callback(null, [
            require('${name}/containers/dashboard/route').default,
            require('${name}/containers/main/route').default
          ])
        },'childRoutes')
      }
    }
  ]
}`
	}
	return `'use strict';
export default {
  path: '/',
  component: require('${name}/layout/').default,
  indexRoute: { component: require('${name}/containers/dashboard/').default },
  childRoutes: [
    require('${name}/containers/dashboard/route').default,
    require('${name}/containers/main/route').default
  ]
}`
}

function generateChildRoute(name,split){
	if(split){
		return `'use strict';
export default {
  childRoutes:[
    {
      path:'/${name}',
      getComponents(location, callback) {
        require.ensure([], function (require) {
          callback(null, require('./index').default)
        },'${name}')
      }
    }
  ]
}`
	}
	return `'use strict';
export default {
  path: '/${name}',
  component: require('./index').default
}`
}


function generateApp(name,immutable){
  let historyStr
  if(immutable){
    historyStr = `const history = syncHistoryWithStore(hashHistory, store,{
  selectLocationState (state) {
      return state.get('routing').toJS();
  }
});`
  }else{
    historyStr = `const history = syncHistoryWithStore(hashHistory, store);`
  }
	return `'use strict';
__webpack_public_path__ = CFG.path
import "babel-polyfill";
import '@alife/next/dist/next.min.css';
import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import store from '${name}/store';
import rootRoute from './route';
import Effect from '${name}/containers/dashboard'

import {Router, Route, IndexRoute, hashHistory} from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
${historyStr}


ReactDom.render(
  <Provider store={store}> 
    <Router history={history} routes={rootRoute} />
  </Provider>,
  document.getElementById('container')
);
`
}

function generateRootReducer(name,immutable){
  if(immutable){
    return `
'use strict';
import {combineReducers} from 'redux-immutable'
import dashboard from '${name}/containers/dashboard/reducer'
import Immutable from 'immutable';
import {
  LOCATION_CHANGE
} from 'react-router-redux';
const rootReducer = combineReducers({
  dashboard,
  routing: (state = Immutable.fromJS({
    locationBeforeTransitions: null
  }), action) => {
    if (action.type === LOCATION_CHANGE) {
      return state.merge({
        locationBeforeTransitions: action.payload
      });
    }
    return state;
  }
});
export default rootReducer;
`
  }else{
    return `
'use strict';
import { combineReducers } from 'redux'
import dashboard from '${name}/containers/dashboard/reducer'
import { routerReducer } from 'react-router-redux';
const rootReducer = combineReducers({
  dashboard,
  routing: routerReducer
});
export default rootReducer;
`
  }
}



function generateCreateReducer(){
  return `
import Immutable, { Map, List } from 'immutable';

export default function createReducer(initialState, handlers) {
  return (state = initialState, action) => {
    if (!Map.isMap(state) && !List.isList(state)) {
      state = Immutable.fromJS(state);
    }
    const handler = handlers[action.type];
    if (!handler) {
      return state;
    }
    state = handler(state, action);
    if (!Map.isMap(state) && !List.isList(state)) {
      throw new TypeError('Reducers must return Immutable objects.');
    }
    return state;
  };
}`
}

function generateContainerReducer(name){
  return `
import {INCREAMENT,DECREAMENT}  from '../../actions/dashboard'
import createReducer from '${name}/reducers/createReducer'



export default createReducer({count : 0},{
  [INCREAMENT]:(state,{data})=>{
    return state.update('count',(val)=>{
      return data === undefined ? val+1:val+data
    })
  }
  ,[DECREAMENT]:(state,{data})=>{
    return state.update('count',(val)=>{
      return data === undefined ? val-1:val-data
    })
  }
})`
}

const Route = {
	handler:function(config){
    let rootDir = `${config.appDir}/${config.appName}`
		let tarRoot = `${config.appDir}/${config.appName}/src/pages/${config.projectName}`
		// console.log('tarRoot :',tarRoot)
		// console.log('config :',config)
		vfs.writeFile(generateApp(config.projectName,config.immutable),`${tarRoot}/app.js`)
		vfs.copyDir(`${config.basePath}/webpack-react/router/template/layout`,`${tarRoot}/layout`)
		vfs.copyDir(`${config.basePath}/webpack-react/router/template/main`,`${tarRoot}/containers/main`)
		vfs.writeFile(generateRootReducer(config.projectName,config.immutable),`${tarRoot}/reducers/index.js`)
		vfs.writeFile(generateRoute(config.split,config.projectName),`${tarRoot}/route.js`)
		vfs.writeFile(generateChildRoute('dashboard',config.split),`${tarRoot}/containers/dashboard/route.js`)
		vfs.writeFile(generateChildRoute('main',config.split),`${tarRoot}/containers/main/route.js`)
    if(!config.opr || config.opr !== 'add'){
      let immutableDependence = ''
      if(config.immutable){
        immutableDependence = `"immutable": "^3.8.1",
    "redux-immutable": "^3.0.8",`
        vfs.writeFile(generateCreateReducer(),`${tarRoot}/reducers/createReducer.js`)
        vfs.writeFile(generateContainerReducer(config.projectName),`${tarRoot}/containers/dashboard/reducer.js`)
        vfs.copyFile(`${config.basePath}/webpack-react/router/template/dashboard/index.js`,`${tarRoot}/containers/dashboard/index.js`)
      }
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
    "react-router": "^2.6.1",
    "react-router-redux": "^4.0.5",
    "redux": "^3.5.2",
    "react":"^15.3.0",
    ${immutableDependence}
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
      `,`${rootDir}/package.json`)
    }
	}
}

// Route.handler({
// 	basePath:'/Users/sheweichun/npmplace/dyf/src/init',
// 	appDir:'/Users/sheweichun/test',
// 	appName:'example',
// 	split:false
// })
module.exports = Route