import { ref } from "vue";

/**
 * 由来:
 * 为什么还要对 loading 再次封装一下
 * 因为 loading 组件是全局的,通过 vuex 来控制是否显示
 * 我们vuex是 4.0的,但是vue代码是 2.0的
 * 导致每次调用 vuex 的数据都要创建 store变量和 loading变量 来控制 loading和获取loading
 * 不如放在这统一管理
 * 
 * 注意: 
 * 可直接引入这里的 loading, 也可引用 inject 中的 loading
 */

let _store = null;
export const loading = ref(false);

/**
 * 因为 js文件引入的 vuex - useStore 方法执行后返回为空
 * 所以只能靠引用的文件给了... (后续排查一下为什么)
 */
export const loadingInit = (useStore) => {
	_store = useStore();
	setLoading();
};

export const loadingOn = () => {
	_store.commit('setLoading', true);
	setLoading();
};

export const loadingOff = () => {
	_store.commit('setLoading', false);
	setLoading();
};

/**
 * 手动更新
 * 先不用计算属性
 */
function setLoading() {
	loading.value = _store.getters.loading;
}