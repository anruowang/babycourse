import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

// 引入login 模块
// import LoginMod from "@/store/modules/loginMod";
import IndexMod from "@/store/modules/indexMod";
import schoolMod from "@/store/modules/schoolMod";
import ShareMod from "@/store/modules/shareMod";
import ColumnMod from "@/store/modules/columnMod";
import CourseMod from "@/store/modules/courseMod";
export default new Vuex.Store({
  // 通过modules属性引入login 模块。
  modules: {
    // loginMod:LoginMod,
    indexMod:IndexMod,
    schoolMod:schoolMod,
    shareMod:ShareMod,
    columnMod:ColumnMod,
    courseMod:CourseMod,
  }

})
