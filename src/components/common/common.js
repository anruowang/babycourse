/**
 * Created by hgx on 2018/11/27.
 */

let commonModel = {
  baseURL: 'http://kctest.lingzhiyunfu.com',
  baseURL2:'http://agenttest.lingzhiyunfu.com',
  // baseURL2: 'http://kctest.lingzhiyunfu.com',
  appId: 'wx340a457ce8b3c5d8',
  setCookie(cname, cvalue, hours){
    //属性名，属性值、保存时间（小时）
    let saveTime;
    if (hours) {
      saveTime = hours
    } else {
      saveTime = 24 //默认保存24小时
    }
    let d = new Date();
    d.setTime(d.getTime() + (saveTime * 60 * 60 * 1000));
    let expires = 'expires=' + d.toGMTString();
    document.cookie = cname + '=' + cvalue + ';' + expires;
  },
  getCookie(cname){
    //获取 cookie 值的函数
    let name = cname + '=';
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i].trim();
      if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return ""
  },

  getUrlParam(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    let r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
  },
  test_phone(phone) {//验证手机号
    if (/^1\d{10}$/.test(phone)) {
      return true;
    } else {
      return false
    }
  },
  test_code(code) {
    if (/^[0-9]{4}$/.test(code)) {//验证手机号
      return true;
    } else {
      return false;
    }
  },

  returnFloat(value){
    var value = Math.round(parseFloat(value)) / 100;
    if(value%1!==0){
      value=value.toFixed(2)
    }
    return value;
    // var xsd = value.toString().split(".");
    // if(xsd<10){
    //   if (xsd.length == 1) {
    //     value = value.toString() + ".00";
    //     return value;
    //   }
    //   if (xsd.length > 1) {
    //     if (xsd[1].length < 2) {
    //       value = value.toString() + "0";
    //     }
    //     return value;
    //   }
    // } else {
    //
    // }



  },
  userInfo(data) {
    var obj = JSON.parse(window.localStorage.user_info);
    return obj[data];
  },
  babyInfo() {
    if(!window.localStorage.baby_info){
      return false;
    }
    var obj = JSON.parse(window.localStorage.baby_info);
    return obj;
  },
  add0(m){return m<10?'0'+m:m },
  format(shijianchuo){
    var time = new Date(shijianchuo*1000);
    var y = time.getFullYear();
    var m = time.getMonth()+1;
    var d = time.getDate();
    // var h = time.getHours();
    // var mm = time.getMinutes();
    // var s = time.getSeconds();
    // return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
     return y+'-'+this.add0(m)+'-'+this.add0(d)
  },

  GetDateStr(AddDayCount) {
    var dd = new Date();
    dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
    var y = dd.getFullYear();
    var m = dd.getMonth()+1;//获取当前月份的日期
    var d = dd.getDate();
    return y+'-'+this.add0(m)+'-'+this.add0(d)
  },

  daytxt(day){
    let daytxt=day;
    if(day==this.GetDateStr(-1)){
      daytxt="昨天"
    }
    if(day==this.GetDateStr(0)){
      daytxt="今天"
    }
    if(day==this.GetDateStr(1)){
      daytxt="明天"
    }
    return daytxt;
  },

  wan_w(num){
    if(num>10000){
      let w=(num/10000)+'w'
      return w
    } else {
      return num
    }
  },


}
export default commonModel;

