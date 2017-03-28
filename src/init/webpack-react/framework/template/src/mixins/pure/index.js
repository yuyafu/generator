'use strict';

import React from 'react';


import PureRenderMixin from 'react-addons-pure-render-mixin';

export default  (ComposedComponent) => class PureRenderComponent extends React.Component {

  shouldComponentUpdate(){
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  
  render() {
    return <ComposedComponent {...this.props} {...this.state}/>
  }
}

