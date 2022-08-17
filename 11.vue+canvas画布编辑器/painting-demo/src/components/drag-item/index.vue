<template>
	<div
		:key="item.key"
		class="drag-item r-absolute"
		:style="frameStyle"
		ref="dragItem"
	>
		<div
			v-show="!isMove && item.showBorder && rotate"
			class="drag-point drag-rotate r-flex r-ai-c r-jc-c"
			:class="{ 'drag-big': actionIsBig }"
			:style="{transform: `translate(${leftMin}, ${topMin})`}"
			@touchstart.stop="bridgeFunction($event, 'rotateTouchStart')"
			@touchmove.stop="bridgeFunction($event, 'rotateTouchMove')"
			@touchend.stop="bridgeFunction($event, 'rotateTouchEnd')"
		>
			<i class="cjxq_iconfont icon_cjxq_guanbi r-bold" style="font-size: 12px;" />
		</div>
		<div
			v-show="!isMove && item.showBorder"
			class="drag-point drag-close r-flex r-ai-c r-jc-c"
			:class="{ 'drag-big': actionIsBig }"
			:style="{transform: `translate(${leftMax}, ${topMin})`}"
			@click.stop="handleClose"
		>
			<i class="cjxq_iconfont icon_cjxq_guanbi r-bold" style="font-size: 12px;" />
		</div>

		<div
			:class="['box', { 'drag-border': item.showBorder && !isMove}]"
			ref="boxSlot"
			@touchstart.stop="bridgeFunction($event, 'handleTouchStart')"
			@touchmove.stop="bridgeFunction($event, 'handleTouchMove')"
			@touchend.stop="bridgeFunction($event, 'handleTouchEnd')">
			<slot :item="item" :textArr="textArr" :fontStyle="fontStyle" :isCenterLine="isCenterLine" />
		</div>

		<div
			v-show="!isMove && item.showBorder && copy"
			class="drag-point drag-copy r-flex r-ai-c r-jc-c"
			:class="{ 'drag-big': actionIsBig }"
			:style="{transform: `translate(${leftMin},${topMax})`}"
			@click.stop="handleCopy"
		>
			<i class="cjxq_iconfont icon_cjxq_fuzhi r-bold" style="font-size: 12px;" />
		</div>
		<div
			v-show="!isMove && item.showBorder"
			class="drag-point drag-resize r-flex r-ai-c r-jc-c"
			:class="{ 'drag-big': actionIsBig }"
			:style="{transform: `translate(${leftMax},${topMax})`}"
			@touchstart.prevent.stop="resizeTouchStart"
			@touchmove.prevent.stop="resizeTouchMove"
			@touchend.prevent.stop="resizeTouchEnd"
		>
			<i class="cjxq_iconfont icon_cjxq_suofang r-bold" style="font-size: 12px;" />
		</div>
	</div>
</template>

<script>
import { isAndroid } from '@/utils/index';

export default {
	name: 'drag-item',
	props: {
		item: Object, // 展示的内容对象

		isFontType: { type: Boolean, default: false }, // 是否内容为字体 (字体的需要特殊操作一下)

		parentW: { type: Number, default: 414 }, // 页面上展示的图片 - 宽度

		parentH: { type: Number, default: 414 }, // 页面上展示的图片 - 高度

		isBothMove: { type: Boolean, default: false }, // 外层是否正在双指移动

		copy: { type: Boolean, default: true },

		rotate: { type: Boolean, default: false }, // 是否支持旋转
	},
	data() {
		return {
			width: 120, // 默认初始尺寸
			height: 50,
			originW: 120,
			originH: 120,
			resizeStartX: 0,
			resizeStartY: 0,
			top: 0, // 移动中的 - 定位 top
			left: 0, // 移动中的 - 定位 left
			originT: 0, // 移动前的 - 定位 top
			originL: 0, // 移动前的 - 定位 left
			moveStartX: 0, // 每次拖拽之前记录的 x轴 值
			moveStartY: 0, // 每次拖拽之前记录的 y轴 值
			isMove: false, // 是否正在移动
			resize: false, // 是否正在放大缩小
			clickStartTime: null, // 记录初次接触时间,用来判断是否为点击

			// 旋转
			isRotate: false,
			rotateDeg: 0,
			rotateStartX: 0,
			rotateStartY: 0,


			// ---------- 字体相关 ----------
			isCenterLine: false, // 是否有删除线
			fontSize: 30, // 字体大小 (这个比较特殊,就放在组件内来操控,其他样式都以对象为中心)
			stepFontSize: 16, // 初始字体大小步数
		};
	},
	computed: {
		frameStyle() {
			const { left, top, item, isMove, isFontType, width, height, rotateDeg } = this;
			let basics = {
				transform: `translate(${left}px, ${top}px) rotate(${rotateDeg}deg)`,
				zIndex: item.zIndex || 100,
			};

			if (!isFontType) {
				basics = {
					...basics,
					width: `${width}px`,
					height: `${height}px`,
					minWidth: `${item.src ? 50 : 100}px`,
					minHeight: `${item.src ? 50 : 100}px`, // 这里是为了达到 - 有图片时能比没有图片时缩小范围大一些
				};
			}
			return basics;
		},
		// 扩大到一定范围则扩大三个功能键 (让用户更好触屏)
		actionIsBig() {
			return this.width > 60 || this.height > 60;
		},
		// 删除键 - 距离顶部最小距离
		topMin() {
			return this.top < 5 ? 0 : '-50%';
		},
		// 放大键 - 距离顶部最大距离
		topMax() {
			return this.top >= this.parentH - this.height - 5 ? 0 : '50%';
		},
		// 复制键 - 距离左边最小距离
		leftMin() {
			return this.left < 5 ? 0 : '-50%';
		},
		// 删除键 & 放大键 - 距离左边最大距离
		leftMax() {
			return this.left >= this.parentW - this.width - 5 ? 0 : '50%';
		},

		// ---------- 字体相关 ----------
		// 文本输入框的动态样式
		fontStyle() {
			if (!this.isFontType) return {};
			const { textStyle, color, opacity, fontFamily } = this.item;
			let obj = {
				color,
				opacity,
				fontFamily,
				fontSize: this.fontSize + 'px',
				...textStyle,
				borderBottom: `${this.fontSize / 14}px solid ${textStyle.isUnderLine ? color : 'transparent'}` // 下划线特殊处理
			};
			return obj;
		},
		// 需要将 text 转为数组,为了下划线功能(因为下划线和删除线是同一个属性,不能同时存在)
		textArr() {
			const { text } = this.item;
			return text ? text.split('\n') : [];
		},
	},
	watch: {
		// ---------- 字体相关 ----------
		'item.fontSize': {
			handler(val) {
				this.fontSize = val;
			}
		},
		'item.textStyle': {
			handler(val) {
				this.isCenterLine = val.isCenterLine || false;
			}
		},
		'item.width': {
			handler(val) {
				this.width = val;
			}
		},
		'item.height': {
			handler(val) {
		    this.height = val;
			}
		},
		'item.top': {
			handler(val) {
				this.top = val;
			}
		},
		'item.left': {
			handler(val) {
				this.left = val;
			}
		},
	},
	created() {
		this.width = this.item.width || 120; // 文本的初始宽度
		this.height = this.item.height || 50; // 文本的初始高度
		this.left = this.item.left !== undefined ? this.item.left : this.parentW / 2 - 60; // 文本的初始坐标 - 左侧距离
		this.top = this.item.top !== undefined ? this.item.top : this.parentH / 2 - 60; // 文本的初始坐标 - 顶部距离

		// ---------- 字体相关 ----------
		this.fontSize = this.item.fontSize;
	},
	mounted() {
		// 绑定 dom 标签
		this.$emit('handleChange', {
			...this.item,
			el: this.$refs.boxSlot.children[0], // 注意,这里默认绑定插槽内第一个字元素
		});
	},
	methods: {
		/**
		 * 点击事件
		 */
		handleClick() {
			if (this.clickStartTime && (+new Date() - this.clickStartTime) < 250) {
				this.$emit('onClick', this.item);
				return true;
			}
		},
		/**
		 * 中间层方法 - 用来给统一处理手指事件
		 */
		bridgeFunction(e, funName) {
			if (!isAndroid()) e.preventDefault();

			if (funName === 'handleTouchEnd') {
				this.isMove = false;
				this.$emit('bothMoveEnd');
				if (this.handleClick()) return; // 是否为点击事件
				return this[funName](e); // 移开手指事件比较特殊
			}
			if (e.touches.length === 2) { // 双指放大缩小统一交给外层处理
				return this.$emit(funName === 'handleTouchStart' ? 'bothMoveStart' : 'bothMoveing', e);
			}
			if (this.isBothMove) return; // 如果外层正在执行双指事件,这里就不能触发拖拽事件
			this[funName](e);
		},

		// ------------------- 拖拽事件 -------------------
		handleTouchStart(el) {
			this.moveStartX = el.touches[0].pageX;
			this.moveStartY = el.touches[0].pageY;
			this.originT = this.top;
			this.originL = this.left;
			this.isMove = true;
			this.clickStartTime = +new Date();
			this.$emit('touchStart');
		},
		handleTouchMove(el) {
			const moveX = el.touches[0].pageX - this.moveStartX;
			const moveY = el.touches[0].pageY - this.moveStartY;
			let left = this.originL + moveX;
			let top = this.originT + moveY;

			// 限制最大偏移量
			// let itemWidth = this.$refs.dragItem.clientWidth;
			// let itemHeight = this.$refs.dragItem.clientHeight;
			// this.left = left <= 0 ? 0 : left + itemWidth > this.parentW ? this.parentW - itemWidth : left;
			// this.top = top <= 0 ? 0 : top + itemHeight > this.parentH ? this.parentH - itemHeight : top;
			this.left = left;
			this.top = top;
			if ((Math.abs(moveX) + Math.abs(moveY)) > 10) {
				// 有些机型只要触屏就会触发 move事件,所以这里加个判断先
				this.clickStartTime = null; // 只要移动了就清空初始时间戳
			}
		},
		handleTouchEnd() {
			this.$emit('handleChange', {
				...this.item,
				showBorder: true,
				width: this.width,
				height: this.height,
				left: this.left + this.item.el.offsetLeft,
				top: this.top + this.item.el.offsetTop,
			});
		},

		// ------------------- 放大缩小事件 -------------------
		resizeTouchStart(el) {
			this.resizeStartX = el.touches[0].pageX;
			this.resizeStartY = el.touches[0].pageY;
			this.originW = this.$refs.dragItem.clientWidth;
			this.originH = this.$refs.dragItem.clientHeight;
			this.resize = true;
			this.stepFontSize = this.fontSize;
		},
		resizeTouchMove(el) {
			let moveW = el.touches[0].pageX - this.resizeStartX;
			let moveH = el.touches[0].pageY - this.resizeStartY;
			// 限制在容器内缩放
			// if (
			// 	(moveW > 0 && this.width >= this.parentW - this.left) ||
			// 	(moveH > 0 && this.height >= this.parentH - this.top)
			// ) return;

			// 等比缩放
			if (!this.isFontType) {
				if (moveW <= moveH) {
					moveH = moveW;
				} else {
					moveW = moveH;
				}
			}

			let width = this.originW + moveW;
			let height = this.originH + moveH;
			// let maxW = this.left > 0 ? this.parentW - this.left : this.parentW;
			// let maxH = this.top > 0 ? this.parentH - this.top : this.parentH;
			// this.width = width >= maxW ? maxW : width;
			// this.height = height >= maxH ? maxH : height;

			this.width = width;
			this.height = height;
			this.fontSize = this.stepFontSize + (moveW) / 5;
		},
		resizeTouchEnd(el) {
			this.resize = false;
			this.$emit('resizeTouchEnd');
			this.$emit('handleChange', {
				...this.item,
				fontSize: this.fontSize,
				width: this.width,
				height: this.height,
				left: this.left + this.item.el.offsetLeft,
				top: this.top + this.item.el.offsetTop,
			});
		},
		// ------------------- 旋转事件 -------------------
		rotateTouchStart(el) {
			this.rotateStartX = el.touches[0].pageX;
			this.rotateStartY = el.touches[0].pageY;
			this.isRotate = true;
		},
		rotateTouchMove(el) {
			let moveX = el.touches[0].pageX;
			let moveY = el.touches[0].pageY;
			let centerX = this.left + (this.originW / 2);
			let centerY = this.top + (this.originH / 2);
			 // 旋转的角度
			this.rotateDeg = Math.atan2((centerY - moveY), (centerX - moveX)) * (180 / Math.PI) - 45;
		},
		rotateTouchEnd(el) {
			this.isRotate = false;
			this.$emit('handleChange', {
				...this.item,
				fontSize: this.fontSize,
				width: this.width,
				height: this.height,
				left: this.left + this.item.el.offsetLeft,
				top: this.top + this.item.el.offsetTop,
				rotate: this.rotateDeg
			});
		},
		// ------------------- 其他事件 -------------------
		handleCopy() {
		  this.$emit('copy', this.item);
		},
		handleClose() {
			this.$emit('close', this.item.key);
		},
	},
};
</script>

<style lang="scss" scoped>
.drag-item {
	display: flex;
	align-items: center;
	left: 0;
	top: 0;
	transition: all 10ms linear;
	min-width: 200px;
	min-height: 100px;
	.box {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		&::after {
			content: "";
			position: absolute;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			z-index: 1;
			border: 1px solid transparent;
		}
		&.drag-border {
			&::after {
				border-color: #eee
			}
		}
	}
	.drag-big {
		width: 60px !important;
		height: 60px !important;
	}
	.drag-point {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		position: absolute;
		z-index: 4000;
		user-select: none;
		cursor: pointer;
		transition: all 10ms linear;
		& > i {
			width: 36px;
			height: 36px;
			text-align: center;
			line-height: 36px;
			border-radius: 50%;
			background-color: #fff;
		}
	}
	.drag-close {
		text-align: center;
		right: 0;
		top: 0;
	}
	.drag-resize {
		right: 0;
		bottom: 0;
	}
	.drag-copy {
		left: 0;
		bottom: 0;
	}
	.drag-rotate {
		left: 0;
		top: 0;
	}

}
</style>
