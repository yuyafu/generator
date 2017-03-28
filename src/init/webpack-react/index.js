'use strict'
module.exports = {
    handler: (config) => {
      console.log('handle', config);
      config.plugins.forEach((plugin) => {
    plugin && plugin.handler(config);
  });
},
	Framework:require('./framework'),
	Project:require('./project'),
	Router:require('./router'),
	// CodeSplit:require('./codeSplit'),
	// Immutable:require('./immutable'),
}