/**
 * Created by de'l'l on 2018/12/4.
 */


const state = {
  share_mask_show:false,
};
const mutations= {
  iswx_share(state, num){
    state.share_mask_show = num;
  }
};


const actions= {
  IsWxShare({ commit}, val) {
    commit("iswx_share", val);
  },
};
const getters = {

};

// 不要忘记把state, mutations等暴露出去。
export default {
  state,
  mutations,
  actions,
  getters
}


