'use strict';

import Reqwest from 'reqwest';
import Feedback from '@alife/next/lib/feedback';
import querystring from './querystring'
const Toast = Feedback.toast



var tools = {
    /*
     * 调用改核心方法 统一接口处理
     * */
    fetchData: function(param, suc = ()=> {}, err = ()=> {}, complete = ()=> {}) {
        var apiInfo = this._getApi(param.api);
        param.url = param.url || apiInfo.url ;
        param.method = param.method || apiInfo.method ;
        if(param.type !== 'json'){
            let data = param.data
            if(data){
                param.data = querystring(data)
            }
        }
        if (param.method === 'jsonp') {
            param.method = 'get';
            param.type = 'jsonp';
        }
        return Reqwest(param);
    },
    ajax : function(param){
        let loadingHandle = null;
        if(param.showLoading){
            Toast.show({
                type: 'loading',
                content: '数据加载中...',
                duration: 0
            })
        }
        return this.fetchData(param).then(function(resp){
            if(resp.code !== 0){
                setTimeout(()=>{
                    Toast.show({
                        type:'error',
                        content:resp.msg || '服务端请求错误'
                    })
                })
                return 
            }
            if(param.tip){
                setTimeout(()=>{
                    Toast.success(param.tip)
                })
            }
            return resp
        },function(err,msg){
            setTimeout(()=>{
                Toast.show({
                    type:'error',
                    content:msg || '请求错误，请检查请求地址或请求方法是否有误。'
                })
            })
        })
        .always(function(resp){
            if(param.showLoading) Toast.hide();
        })
    },
    getToken() {
        var $token = document.getElementsByName('_tb_token_');
        return $token.length ? $token[0].value : '';
    },
    isDaily(){
        var host = window.location.host;
        return host.indexOf('daily') > -1;
    },
    isLocal(){
        let localList = ['localhost','127.0.0.1'];
        let hostname = location.hostname;
        return _.indexOf(localList,hostname) > -1;
    },
    isString: function(str) {
        return typeof str === 'string'
    },_eval : function(str){
        var arr = str.split('.');
        var obj = {};
        try{
            if (arr.length > 1) {
                obj = _.cloneDeep(CFG.api);
                arr.map(f=>{
                    obj = obj[f];
                })
            } else {
                obj = _.cloneDeep(CFG.api[str]);
            }
        }catch(e){}
        return obj;
    },
    /**
     * 接口处理
     * @param apiInfo 字符串格式的 api
     */
    _getApi : function(apiInfo){
        let temp = apiInfo && apiInfo.indexOf('.')> -1 ? apiInfo.split('.') : [apiInfo];
        let apiMap = CFG.api;

        let result = {
            method : 'get',
            url : ''
        };

        /*
         *定义API的时候，默认字符串，方法为get
         *自定义方法的时候，传入数组形式，第一个是接口字符串，第二个是方法
         */
        temp.forEach(function(item){
            apiMap = apiMap[temp];
        })

        if(!apiMap){
            // console.warn('API: CFG.api.' + apiInfo +  '未正确定义');
            return
        }

        if(this.isString(apiMap)){
            result.url = apiMap;
        }else{
            result.url = apiMap[0];
            result.method = apiMap[1];
        }
        //添加通用参数
        /*if(result.url.indexOf('?') === -1){
            result.url +='?';
        }else{
            result.url +='&';
        }
        result.url += '_tb_token_=' + this.getToken();
        result.url += '&_input_charset=utf-8';*/
        return result;
    },
    namespace: function(name) {
        return function(v) {
            return name + '-' + v;
        }
    }
};
export const isArray = (o)=>{
    return Object.prototype.toString.call(o) === '[object Array]';
}

export const NameSpace = tools.namespace.bind(tools);
export const Fetch = tools.fetchData.bind(tools);
export const Ajax = tools.ajax.bind(tools);
export default tools;
