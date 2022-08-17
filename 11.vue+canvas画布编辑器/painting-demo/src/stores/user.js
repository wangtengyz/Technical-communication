const userStore = {
	namespaced: true,
	state: () => ({
		userInfo: {}
	}),
	mutations: {
		setUser(state, payload) {
			state.userInfo = payload;
		}
	}
};
export default userStore;
