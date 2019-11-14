import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isSuper: ""
  },
  mutations: {
    setSysData (state, config) {
      Object.keys(config).forEach(key=>{
          state[key] = config[key];
      });
    },
    setIsSuper(state, isSuper) {
      state.isSuper = isSuper;
    }
  },
  getters:{
  },
  actions: {
  },
  modules: {
  }
})
