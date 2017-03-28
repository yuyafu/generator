'use strict';

import Util,{ NameSpace,isArray } from 'util/index';
let ns = NameSpace('api');
var api = {}
/**例子
export const UPDATE_SCHEDULE_INFO = ns('UPDATE_SCHEDULE_INFO')
api[UPDATE_SCHEDULE_INFO] = (getState,param)=>{
  const{schedule} = getState().effect
  let startDate = moment(schedule.weekRange.startDate).format('YYYY-MM-DD')
  ,endDate = moment(schedule.weekRange.endDate).format('YYYY-MM-DD')
  return Util.ajax({
      api:'**********',
      data:merge({},{
        startDate,
        endDate
      },param)
    })
}
**/


function wrapper(obj){
  return isArray(obj) ? obj : [obj]
}


function thunkMiddleware(_ref) {
  var dispatch = _ref.dispatch;
  var getState = _ref.getState;

  return function (next) {
    return function (action) {
      if(!action) return 
      if(typeof action === 'function'){
      	return action(dispatch, getState)
      }else if(action.ajaxType){
      	let tmpType = wrapper(action.ajaxType)
        ,tmpParam = wrapper(action.param)
      	tmpType.forEach((item,index)=>{
          let arr = item.split(':')
          ,curParam = tmpParam[index] || {}
          ,subParam = curParam.sub
          ,reserArr = arr.slice(1)
          if(subParam){
            curParam.sub = null
            delete curParam.sub
          }
      		api[arr[0]](getState,tmpParam[index]).then((resp)=>{
      			dispatch({
      				type:arr[0],
      				data:resp
      			})
            if(reserArr && reserArr.length > 0){
              if(subParam.callBack && typeof(subParam.callBack) === 'function'){
                subParam = subParam.callBack(subParam,resp)
              }
              if(!subParam) return
              reserArr.forEach((item)=>{
                api[item](getState,subParam).then((resp1)=>{
                  dispatch({
                    type:item,
                    data:resp1
                  })
                })
              })
            }
      		})
      	})
      }
      if(action.type) return next(action)
    };
  };
}

export default thunkMiddleware