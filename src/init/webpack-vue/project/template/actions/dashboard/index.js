'use strict';

import Util, { NameSpace } from 'util';

let ns = NameSpace('dashboard');

export const INCREAMENT = ns('INCREAMENT')
export const DECREAMENT = ns('DECREAMENT')

export function onIncrement(){
	return {
		type:INCREAMENT
	}
}

export function onDecrement(){
	return {
		type:DECREAMENT
	}
}

export function incrementAsync(){
	return (dispatch)=>{
		return setTimeout(()=>{
			dispatch(onIncrement())
		},1000)
	}
}