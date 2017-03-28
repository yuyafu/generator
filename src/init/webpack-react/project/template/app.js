'use strict';
__webpack_public_path__ = CFG.path
import "babel-polyfill";
import '@alife/next/dist/next.min.css';
import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import Effect from './containers/dashboard'



ReactDom.render(
  <Provider store={store}> 
    <Effect />
  </Provider>,
  document.getElementById('container')
);
