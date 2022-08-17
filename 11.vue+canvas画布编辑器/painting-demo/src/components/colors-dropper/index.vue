<template>
	<div
		v-show="ready"
		class="v-color-dropper r-absolute r-pointer"
		ref="dropperItem"
		:style="{
			transform: `translate(${position.x}px, ${position.y}px)`,
		}"
		@touchstart.stop="bridgeFunction($event, 'handleTouchStart')"
		@touchmove.stop="bridgeFunction($event, 'handleTouchMove')"
		@touchend.stop="bridgeFunction($event, 'handleTouchEnd')"
	>
		<div class="v-dropper" :style="dropperStyle"/>
	</div>
</template>
<script>

import { getPixelRatio, isAndroid } from '@/utils/index';

export default {
	name: 'color-dropper',
	props: {
		image: {
			type: String,
			required: true
		},
		originW: Number,
		originH: Number
	},
	data() {
		return {
			ready: false,
			isMove: false,
			currentColor: 'transparent',
			moveStartX: 0,
			moveStartY: 0,
			originL: 0,
			originT: 0,
			position: {
				x: 0,
				y: 0
			},
			ratio: 2
		};
	},
	computed: {
		dropperStyle() {
			if (this.isMove) {
				return {
					borderWidth: '3px',
					backgroundColor: 'transparent',
					borderColor: this.currentColor,
					transform: 'scale(4)',
					boxShadow: '0px 0 2px 0 #666'
				};
			} else {
				return {
					borderWidth: '2px',
					borderColor: '#fff',
					backgroundColor: this.currentColor
				};
			}
		}
	},
	mounted() {
		this.init();
	},
	methods: {
		init() {
			try {
				let canvas = document.createElement('canvas');
				let context = canvas.getContext('2d');
				let ratio = this.ratio = getPixelRatio();
				canvas.setAttribute("width", this.originW * ratio);
				canvas.setAttribute('height', this.originH * ratio);
				canvas.style.width = this.originW + "px";
				canvas.style.height = this.originH + "px";
				context.scale(ratio, ratio);
				let Img = new Image();
				Img.crossOrigin = '';
				Img.src = this.image;
				Img.onload = () => {
					context.drawImage(Img, 0, 0, this.originW, this.originH);
					this.context = context;
					this.position = {
						x: (this.originW / 2) - (25 / this.ratio),
						y: (this.originH / 2) - (25 / this.ratio),
					};
					this.getColorData();
					this.ready = true;
				};
			} catch (error) {
				console.log(error, 'error');
			}
		},
		/**
		 * 中间层方法 - 用来给统一处理手指事件
		 */
		bridgeFunction(e, funName) {
			if (!isAndroid()) e.preventDefault();
			this[funName](e);
		},
		handleTouchStart(el) {
			this.originL = this.position?.x || 0;
			this.originT = this.position?.y || 0;
			this.moveStartX = el.touches[0].pageX;
			this.moveStartY = el.touches[0].pageY;
			this.isMove = true;
		},
		handleTouchMove(el) {
			const moveX = el.touches[0].pageX - this.moveStartX;
			const moveY = el.touches[0].pageY - this.moveStartY;
			let left = this.originL + moveX;
			let top = this.originT + moveY;
			/**
			 * 限制拖拽在图层内
			 * itemWidth、itemHeight 取dropperItem 的一半；
			 * x、y: 当拖拽的位置小于边界时，需要加减1px 来补偿一下，防止得不到颜色；
			 */
			let itemWidth = this.$refs.dropperItem.clientWidth / 2;
			let itemHeight = this.$refs.dropperItem.clientHeight / 2;
			let x = left <= -itemWidth ? -itemWidth + 1 : left + itemWidth > this.originW ? this.originW - itemWidth - 1 : left;
			let y = top <= -itemHeight ? -itemHeight + 1 : top + itemHeight > this.originH ? this.originH - itemHeight - 1 : top;
			this.position = { x, y };
			this.getColorData();
		},
		handleTouchEnd() {
			this.isMove = false;
		},
		getColorData() {
			let { x = 0, y = 0 } = this.position;
			//  context是双倍大小，取色值时需要乘以比例尺，再加上 dropperItem的大小即可；
			let itemW = this.$refs.dropperItem.clientWidth;
			let { data } = this.context.getImageData(parseInt(x * this.ratio + itemW, 10), parseInt(y * this.ratio + itemW, 10), 1, 1);
			this.currentColor = `rgba(${data[0]},${data[1]},${data[2]},${data[3]})`;
			this.$emit('change', { value: this.currentColor, type: 'dropper' }); // 与颜色选择器统一
		}
	}
};
</script>

<style lang="scss" scoped>
.v-color-dropper {
	width: 51px;
	height: 51px;
	top: 0;
	left: 0;
	z-index: 2002;
	.v-dropper {
		position: absolute;
		top: 0;
		left: 0;
		width: 51px;
		height: 51px;
		border-radius: 100%;
		border-style: solid;
		transition: transform 100ms linear;
	}
}
</style>
