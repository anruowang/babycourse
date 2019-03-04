
const state = {
  tab_cur:1,//栏目默认：全部
};
const mutations= {
  change_column_tab(state, num){
    state.tab_cur = num;
  }
};

const actions= {
  changeColumnTab({commit}, val) {
    commit("change_column_tab", val);
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

