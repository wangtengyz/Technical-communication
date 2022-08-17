<template>
	<div
		class="v-customer-btn"
		ref="customerBtn"
		:style="btnStyle"
		@touchstart.stop="bridgeFunction($event, 'handleTouchStart')"
		@touchmove.stop="bridgeFunction($event, 'handleTouchMove')"
		@touchend.stop="bridgeFunction($event, 'handleTouchEnd')"
	/>
</template>

<script>
import { isAndroid } from '@/utils/index';

export default {
	name: 'customer-btn',
	data() {
		return {
			itemWidth: 70,
			itemHeight: 70,
			initialLeft: null,
			initialTop: null,
			maxWidth: document.body.clientWidth,
			maxHeight: document.body.clientHeight,
			top: 0, // 移动中的 - 定位 top
			left: 0, // 移动中的 - 定位 left
			originT: 0, // 移动前的 - 定位 top
			originL: 0, // 移动前的 - 定位 left
			moveStartX: 0, // 每次拖拽之前记录的 x轴 值
			moveStartY: 0, // 每次拖拽之前记录的 y轴 值
			clickStartTime: null
		};
	},
	computed: {
		btnStyle() {
			return {
				transform: `translate(${this.left}px, ${this.top}px)`,
			};
		}
	},
	methods: {
		/**
		 * 中间层方法 - 用来给统一处理手指事件
		 */
		bridgeFunction(e, funName) {
			if (!isAndroid()) e.preventDefault();
			// 先获取好相关信息
			let target = this.$refs.customerBtn;
			this.maxWidth = document.body.clientWidth;
			this.maxHeight = document.body.clientHeight;
			this.initialLeft = target.offsetLeft;
			this.initialTop = target.offsetTop;
			this.itemWidth = target.clientWidth;
			this.itemHeight = target.clientHeight;

			if (funName === 'handleTouchEnd') {
				if (this.handleClick()) return; // 是否为点击事件
				return this[funName](e); // 移开手指事件比较特殊
			}
			this[funName](e);
		},
		/**
		 * 点击事件
		 */
		handleClick() {
			if (this.clickStartTime && (+new Date() - this.clickStartTime) < 250) {
				try {
					this.$point('CLICK_CUSTOMER_BTN');
					my.postMessage({
						key: 'customer',
						value: 'customer-click'
					});
				} catch (e) {
					console.log(e);
				}
				return true;
			}
		},

		// ------------------- 拖拽事件 -------------------
		handleTouchStart(el) {
			console.log('el', el);
			this.moveStartX = el.touches[0].pageX;
			this.moveStartY = el.touches[0].pageY;
			this.originT = this.top;
			this.originL = this.left;
			this.clickStartTime = +new Date();
		},
		handleTouchMove(el) {
			const moveX = el.touches[0].pageX - this.moveStartX;
			const moveY = el.touches[0].pageY - this.moveStartY;
			let left = this.originL + moveX;
			let top = this.originT + moveY;
			let maxTop = this.maxHeight - this.initialTop - this.itemHeight;
			let maxLeft = this.itemWidth - this.maxWidth;
			this.left = left > 0 ? 0 : left < maxLeft ? maxLeft : left; // left 大部分为负数；
			this.top = top > maxTop ? maxTop : top < -this.initialTop ? -this.initialTop : top;
			if ((Math.abs(moveX) + Math.abs(moveY)) > 10) {
				// 有些机型只要触屏就会触发 move事件,所以这里加个判断先
				this.clickStartTime = null; // 只要移动了就清空初始时间戳
			}
		},
		handleTouchEnd() {},
	}
};
</script>

<style lang="scss" scoped>
.v-customer-btn {
    position: fixed;
    right: 0;
    bottom: 200px;
    width: 140px;
    height: 140px;
    z-index: 3001;
    background: url("https://img.alicdn.com/imgextra/i4/826052692/O1CN017CZDG91VkyovSbUX8_!!826052692.png") center / 100% 100% no-repeat;
    transition: all linear 10ms;
}
</style>
