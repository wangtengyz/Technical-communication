import { createStore } from "vuex";
import userStore from './user.js';
import exampleStore from './example.js';

const stores = createStore({
  modules: {
    exampleStore,
    userStore,
  },
  state: () => ({
    loading: false, // 是否展示全局 loading
  }),
  getters: {
    loading (state) {
      return state.loading;
    }
  },
  mutations: {
    setLoading (state, param = !state.loading) {
      state.loading = param;
    }
  },
});
export default stores;
