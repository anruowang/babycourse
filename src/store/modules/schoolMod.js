/**
 * Created by de'l'l on 2018/12/4.
 */


const state = {
  school:0,//栏目默认：全部
  navlist:[],
};
const mutations= {
  change_school(state, num){
    state.school = num;
  },
  get_navlist(state,list){
    state.navlist=list;
  }
};


const actions= {
  changeSchool({ commit}, val) {
    commit("change_school", val);
  },
  getNavlist({ commit}, val) {
    commit("get_navlist", val);
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

