import Vue from 'vue'
import vuex from 'vuex'
import Axios from '@/components/apis/index'
import wx from 'weixin-js-sdk'

const wxplay ={
  order(orderdata,callback,toggleModal){
    let that=this;
    let ajaxURL ='/h5/wxpay_order/';
    Axios.post(ajaxURL, orderdata).then(res => {
      res = res.data;
      const data=res.data;
      if (res.code == 0) {
        if(data.is_buy==0){
          let jsApiParameters = JSON.parse(data.jsapi);
          that.weixinPay(jsApiParameters,callback)
        } else {
          callback(1,"您已报名成功！")
        }

      }
      else {
        toggleModal(res.msg);
      }
    })
  },

  weixinPay:function(parmse,callback){
    var vm = this;
    if (typeof WeixinJSBridge == "undefined"){//微信浏览器内置对象。参考微信官方文档
      alert("微信浏览器");
      if( document.addEventListener ){
        alert("浏览器监听");
        document.addEventListener('WeixinJSBridgeReady', vm.onBridgeReady(parmse,callback), false);
      }else if (document.attachEvent){
        document.attachEvent('WeixinJSBridgeReady', vm.onBridgeReady(parmse,callback));
        document.attachEvent('onWeixinJSBridgeReady',vm.onBridgeReady(parmse,callback));
      }
    }else{
      //  alert("直接回调");
      vm.onBridgeReady(parmse,callback);
    }
  },
  /**
   * @method 支付费用方法
   * @param data:后台返回的支付对象,(详情微信公众号支付API中H5提交支付);
   */
  onBridgeReady:function(params,callback){
    var  vm = this;
    WeixinJSBridge.invoke(
      'getBrandWCPayRequest',params,
      function(res){
        // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
        if(res.err_msg == "get_brand_wcpay_request：ok" ){
          callback(1,"您已购买成功！")
        } else if(res.err_msg == "get_brand_wcpay_request：cancel"){
          callback(0,"您已取消支付！")
        }else{
          callback(0,"支付失败！")
        }
      }
    );
  },



}



export default wxplay;
