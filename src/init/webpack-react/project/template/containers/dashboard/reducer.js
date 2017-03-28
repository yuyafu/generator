
import {INCREAMENT,DECREAMENT}  from '../../actions/dashboard'
import createReducer from '../../reducers/createReducer'



export default createReducer(0,{
	[INCREAMENT]:(state,action)=>{
		return state + 2
	}
	,[DECREAMENT]:(state,action)=>{
		return state - 3
	}
})