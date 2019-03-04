/**
 * Created by de'l'l on 2018/12/4.
 */


const state= {
    accessToken: null,//token
    currentUser:null,//当前用户信息
    loginType: 0,//登录类型
    beforeLoginUrl: null,//登录前上个页面
    qunid: null,//群ID
  }
const getters= {
    // not_show(state){
    //   //这里的state对应着上面这个state
    //   return !state.show;
    // }
}
const mutations= {
  changeUser(state, user){
    state.currentUser = user;
  },
  setBeforeLoginUrl(state,url){
    state.beforeLoginUrl = url;
  },
  setQunId(state,id){
    state.qunid = id;
  },
  setAccessToken(state,token){
    state.accessToken = token;
  },
  changeLoginType(state,type){
    state.loginType = type;
  },
}

const actions= {
    updateCurrentUser({ commit, state }, val) {
      commit("changeUser", val);
    },
    updatetBeforeLoginUrl({ commit, state }, val) {
      commit("setBeforeLoginUrl", val);
    },
    updateToken({ commit, state }, val) {
      commit("setAccessToken", val);
    }
  }
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
