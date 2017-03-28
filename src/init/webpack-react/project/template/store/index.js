'use strict';

import { createStore, applyMiddleware} from 'redux';
import thunkMiddleware from '../api';
import reducers from '../reducers';
const createStoreWithMdware = applyMiddleware(
  thunkMiddleware
)(createStore);
var store = createStoreWithMdware(reducers);

var NODE_ENV = process.env.NODE_ENV

if(module.hot && NODE_ENV === "development"){
	module.hot.accept('../reducers',()=>{
		const nextReducer = require('../reducers').default;
		store.replaceReducer(nextReducer);
	})
}

export default store;