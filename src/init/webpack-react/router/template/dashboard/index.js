'use strict';

import React from 'react';
import { connect } from 'react-redux';
import './index.less';
import {onIncrement,onDecrement,incrementAsync}  from '../../actions/dashboard'





class dashboard extends React.Component {
  constructor(props) {
    super(props);
  }
  componentWillMount(){
  }
  render() {
  	const { counter} = this.props
    const { onIncrement, onDecrement ,incrementAsync} = this.props
    return (
      <p>
        <span>sheweichun</span>
        Clicked: {counter.get('count')} times123
        {' '}
        <button onClick={onIncrement}>
          +
        </button>
        {' '}
        <button onClick={onDecrement}>
          -
        </button>
        {' '}
        <button onClick={incrementAsync}>
          Increment async12
        </button>
      </p>
    )
  }
}


const mapStateToProps = (state) => {
  return {
    counter:state.get('dashboard')
  }
}
export default connect(
  mapStateToProps,
  {
    onIncrement,
    onDecrement,
    incrementAsync
  }
)(dashboard)