<template>
	<div :class="['action-container', disabled && 'disabled']" @click="handleStore">
		<OperateIcon :color="color" :size="iconSize" :name='iconName' />
	</div>
</template>

<script>
import OperateIcon from '@/components/operate-icon';

export default {
	components: {
		OperateIcon,
	},
	props: {
		useType: { type: String }, // 前进 \ 后退 ( come / back )

		storeKey: { type: String, require: true }, // 当前store的唯一key

		originImgUrl: { type: [String, Object], require: true }, // 首图的Url

		color: { type: String, default: "#fff" },

		size: { type: [String, Number], default: "24px" } // 图标大小
	},
	created() {
		this.initStore(this.originImgUrl);
	},
	unmounted() {
		this.initStore(this.originImgUrl);
	},
	data() {
		return {
			iconSize: '24px'
		};
	},
	computed: {
		iconName() {
			return this.useType === 'come'
				? 'icon_cjxq_xiayibu'
				: 'icon_cjxq_shangyibu';
		},
		disabled() {
			const curImageStore = this.$store.state.imageStore[this.storeKey];
			if (!curImageStore) return true;
			const { imgDataSource, curStep } = curImageStore;

			if (this.useType === 'come') {
				return curStep + 1 === imgDataSource.length;
			} else {
				return curStep < 1;
			}
		},
	},
	watch: {
		originImgUrl(v) {
			this.initStore(v);
		},
		size(v) {
			this.iconSize = typeof v === 'number' ? `${v}px` : v;
		}
	},
	methods: {
		initStore(url) {
			if (url) {
				this.$store.commit('imageStore/setImage', {
					[this.storeKey]: {
						imgDataSource: [url],
						curStep: 0,
					},
				});
			}
		},
		handleStore() {
			if (this.disabled) return;
			const curImageStore = this.$store.state.imageStore[this.storeKey];
			if (curImageStore) {
				let { imgDataSource, curStep } = curImageStore;
				curStep += this.useType === 'come' ? 1 : -1;
				this.$store.commit('imageStore/setImage', {
					[this.storeKey]: {
						imgDataSource,
						curStep,
					},
				});
			}
		},
	},
};
</script>

<style scoped lang="scss">
.action-container {
  display: inline-block;
  touch-action: none;
}
.disabled {
  .cjxq_iconfont{
    color: #888 !important;
  }
}
</style>
