<template>
	<van-overlay class="loading" :show="vanLoading">
		<div class="r-h-full r-flex r-jc-c r-ai-c">
			<van-loading size="24px" vertical>请稍候...</van-loading>
		</div>
	</van-overlay>
</template>

<script>
import { useStore } from 'vuex';

export default {
	created() {
		this.store = useStore();
	},
	computed: {
		vanLoading() {
			return this.store.getters.loading || false;
		}
	}
};
</script>

<style lang="scss" scoped>
.loading {
  z-index: 3000;
}
</style>
