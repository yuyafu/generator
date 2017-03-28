'use strict';
__webpack_public_path__ = CFG.path
import "babel-polyfill";
import '@alife/next/dist/next.min.css';
import Vue from 'vue'
import Counter from './containers/dashboard'
import store from './store'
new Vue({
  el: '#container',
  store, 
  render: h => h(Counter)
})
