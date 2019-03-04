/**
 * Created by hgx on 2018/11/26.
 */
import router from '../../router'
import axios from 'axios';
import qs from 'qs';

axios.defaults.withCredentials = true;
let token = localStorage.getItem("accessToken");
if (token){
  // axios.defaults.headers = {
  //   "Lztoken": token,
  // }
  axios.defaults.headers.common['Lztoken'] = token
}
axios.interceptors.request.use((config) => {
  if (config.method === 'post') {
    // 在发送请求之前做些什么
    config.data = qs.stringify(config.data);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  if(response.data.code==999){
    window.localStorage.removeItem('user_info');
    window.localStorage.removeItem('accessToken');
      if(router.path!= '/m/author'&&router.path != '/m/login'&&router.path != '/m/loginphone'){
        router.push({path:'/m/login'})
      }
  }
  return response
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
});

export default axios;
