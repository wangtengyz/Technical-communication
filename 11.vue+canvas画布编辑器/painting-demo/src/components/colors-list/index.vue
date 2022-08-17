

<template>
	<div class="r-w-full r-flex r-ai-c r-hidden" style="height: 50px;white-space: nowrap;" >
		<div class="r-hidden r-flex r-ai-c r-fw-n r-pr-4">
			<div class="r-pointer r-pd-16 r-mr-4 " @click="handleClear">
				<i class="cjxq_iconfont icon_cjxq_huanyuan r-c-primary" :class="clearActive ? 'r-c-primary' : 'r-c-999'" style="font-size: 24px;"/>
			</div>
			<div
				class="r-pointer r-pd-16 r-flex r-jc-c r-ai-c"
				@click.stop="handleColorPicker"
			>
				<img class="r-img-48" src="@/assets/images/imageEdit/colorPicker.png" alt="">
			</div>
			<div
				class="r-pointer r-pd-8 r-flex r-jc-c r-ai-c v-action-btn"
				:class="{'active': dropperActive}"
				@click.stop="handleColorDropper"
			>
				<i class="cjxq_iconfont icon_cjxq_xiguan r-fs-40" />
			</div>
		</div>
		<div class="r-flex-1 r-relative r-hidden r-pd-tb-8" style="white-space: nowrap;" ref="colorsScroll">
			<slot/>
		</div>
	</div>
</template>

<script>
import BScroll from '@better-scroll/core';

export default {
	name: 'colors-list',
	props: {
		clearActive: {
			type: Boolean,
			default: false
		},
		dropperActive: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			colorsScroll: null
		};
	},
	updated() {
		this.colorsScroll && this.colorsScroll.refresh();
	},
	mounted() {
		this.$nextTick(() => {
			this.colorsScroll = new BScroll(this.$refs.colorsScroll, {
				probeType: 0,
				startX: 0,
				scrollX: true,
				scrollY: false,
				click: true,
				tap: true,
				disableMouse: false,
				disableTouch: false,
				bindToWrapper: true
			});
			setTimeout(() => this.colorsScroll.refresh(), 100);
		});
	},
	beforeUnmount() {
		this.colorsScroll && this.colorsScroll.destroy();
	},
	methods: {
		handleClear() {
			this.$emit('clear');
		},
		handleColorPicker() {
			this.$emit('picker');
		},
		handleColorDropper() {
			this.$emit('dropper');
		},
	}
};
</script>

<style lang="scss" scoped>
.v-action-btn {
	width: 48px;
	height: 48px;
	border-radius: 100%;
	border: 1px solid #ccc;
	margin: 0 12px;
	i {
		color: #ccc;
		transform: scale(0.75);
	}
	&.active {
		border-color: #3D7FFF;
		i{
			color:#3D7FFF;
			transform: scale(0.75);
		}
	}
}
</style>
