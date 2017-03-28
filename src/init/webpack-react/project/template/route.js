'use strict';


export default {
  childRoutes:[
    {
      path:'/',
      getComponents(location, callback) {
        require.ensure([], function (require) {
          callback(null, require(`layout/`).default)
        },'layout')
      },
      // onEnter(nextState, replace, callback){
      //   console.log('nextState1 :',nextState)
      // },
      // onChange(nextState, replace, callback){
      //   console.log('onChange nextState :',nextState)
      // },
      getIndexRoute(location, callback) {
        require.ensure([], function (require) {
          callback(null, {
            component: require(`containers/dashboard/`).default
          })
        })
      }
      // getChildRoutes(location, callback) {
      //   require.ensure([], function (require) {
      //     callback(null, [
      //       require(`${process.env.CDN}containers/home/routes`),
      //       require(`${process.env.CDN}containers/effect/routes`)
      //     ])
      //   },'childRoutes')
      // }
    }
  ]
}
 