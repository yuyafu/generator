'use strict';
export default {
  childRoutes:[
    {
      path:'/',
      getComponents(location, callback) {
        require.ensure([], function (require) {
          callback(null, require('example/layout/').default)
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
            component: require('example/containers/dashboard/').default
          })
        })
      },
      getChildRoutes(location, callback) {
        require.ensure([], function (require) {
          callback(null, [
            require('example/containers/dashboard/route').default,
            require('example/containers/main/route').default
          ])
        },'childRoutes')
      }
    }
  ]
}