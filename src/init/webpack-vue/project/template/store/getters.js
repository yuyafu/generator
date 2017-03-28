'use strict';

// getters are functions

export default {
  evenOrOdd: state => state.count % 2 === 0 ? 'even' : 'odd'
}