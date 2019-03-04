// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import vuex from 'vuex'
import store from './store'
import App from './App'
import router from './router'
import '@/components/common/fontsize'
import commonModel from '@/components/common/common'
import Axios from '@/components/apis/index'

import VueAwesomeSwiper from 'vue-awesome-swiper'
import VueScroller from 'vue-scroller'
// import MsgDialog from '@/components/common/layer'

import '@/css/swiper.min.css'
import '@/css/index.scss'
import '@/css/login.scss'
Vue.use(VueAwesomeSwiper)
Vue.use(VueScroller)

Vue.config.productionTip = false;
Vue.prototype.$axios = Axios;
Vue.prototype.$commonModel = commonModel;
// Vue.prototype.$msgDialog = MsgDialog;
//

router.beforeEach((to, from, next) => {
  let accessToken=localStorage.getItem('accessToken')
  if(to.path != '/m/author'&&to.path != '/m/login'&&to.path != '/m/loginphone'){
    // 第一次进入项目
    localStorage.setItem("beforeLoginUrl",to.fullPath)
    if(to.path == '/m/setting'){
      localStorage.setItem("beforeLoginUrl",'/m')
    }
    if(!accessToken) {
      next('/m/login')
      return false
    }

  }

  if((to.path == '/' || to.path == '/m/author' || to.path == '/m/login' ||to.path == '/m/loginphone')&& accessToken ){
    // 用户使用后退返回到授权页或者登录页，则默认回到首页
    next('/m')
    return false
  }
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()

});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
