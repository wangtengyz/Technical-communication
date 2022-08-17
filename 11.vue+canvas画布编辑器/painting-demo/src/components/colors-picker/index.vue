<template>
	<div class="v-colors-picker r-flex r-fd-c r-ai-s r-pd-10  r-bg-white">
		<div class="v-picker-wrapper r-w-full r-pd-20 r-relative" >
			<div class="v-picker-colorbox">
				<div
					class="v-picker-colorbox-white r-w-full"
					:style="{
						'background': `linear-gradient(90deg, #fff, ${cursorColor})`
					}"
					ref="wrapperBox"
				/>
				<div
					class="v-picker-colorbox-black r-w-full"
					@click.stop="handleClick"
				/>
			</div>
			<div
				class="v-picker-round r-pointer"
				ref="pickerItem"
				:style="{
					transform: `translate(${pickerX}px, ${pickerY}px)`,
					backgroundColor: currentColor
				}"
				@touchstart.stop="bridgeFunction($event, 'handleStart')"
				@touchmove.stop="bridgeFunction($event, 'handleMove')"
				@touchend.stop="bridgeFunction($event, 'handleEnd')"
			/>
		</div>
		<div class="r-pd-lr-20 r-relative r-pd-tb-12 r-hidden">
			<div class="v-picker-thumb r-w-full" @click.stop="handleThumb"/>
			<div
				class="v-picker-thumb-cursor r-pointer"
				ref="cursorItem"
				:style="{
					transform: `translateX(${cursorX}px)`,
					backgroundColor: cursorColor
				}"
				@touchstart.stop="bridgeFunction($event, 'handleCursorStart')"
				@touchmove.stop="bridgeFunction($event, 'handleCursorMove')"
				@touchend.stop="bridgeFunction($event, 'handleCursorEnd')"
			/>
		</div>

		<div class="r-flex r-jc-sb r-ai-c r-mt-12 r-pd-lr-16">
			<div class="r-pointer r-pd-4" @click="handleConfirm(false)">
				<i class="cjxq_iconfont icon_cjxq_quxiao" style="font-size: 24px;"/>
			</div>
			<div class="r-fs-24 r-c-333">自定义颜色</div>
			<div class="r-pointer r-pd-4"  @click="handleConfirm(true)">
				<i class="cjxq_iconfont icon_cjxq_queding" style="font-size: 24px;"/>
			</div>
		</div>
	</div>
</template>

<script>
import { colorHsvaToRgba } from './color.js';
import { isAndroid } from '@/utils/index';


export default {
	name: 'colors-picker',
	props: {
		position: {
			type: Array,
			default: () => []
		}
	},
	data() {
		return {
			cursorColor: '',
			hValue: 0, // 色阶值
			wrapperWidth: 0,
			wrapperHeight: 0,
			pickerStartX: 0,
			pickerStartY: 0,
			pickerOriginX: 0,
			pickerOriginY: 0,
			pickerX: 0,
			pickerY: 0,

			// 色阶柱
			cursorStartX: 0,
			cursorX: 0,
			cursorOriginLeft: 0,
		};
	},
	computed: {
		currentColor() {
			let sValue = parseInt(((this.pickerX - 10) / this.wrapperWidth * 100), 10);
			let vValue = parseInt(100 - ((this.pickerY - 10) / this.wrapperHeight * 100), 10);
			return colorHsvaToRgba({ h: this.hValue, s: sValue, v: vValue, a: 1 });
		},
	},
	watch: {
		'cursorX': {
			handler(val) {
				// 利用 HSlA色值来设置色阶柱
				this.hValue = this.wrapperWidth ? parseInt(val - 9 / (this.wrapperWidth / 360), 10) : 0;
				this.cursorColor = colorHsvaToRgba({ h: this.hValue, s: 100, v: 100, a: 1 });
			}
		},
		currentColor: {
			handler(val) {
				val && this.$emit('change', val);
			},
		},
	},
	mounted() {
		this.$nextTick(() => {
			this.wrapperWidth = this.$refs.wrapperBox.clientWidth;
			this.wrapperHeight = this.$refs.wrapperBox.clientHeight;
			let defalutPositon = this.position?.length === 3 ? this.position : [240, 200, 60];
			this.cursorOriginLeft = defalutPositon[0];
			this.cursorX = defalutPositon[0];
			this.pickerX = defalutPositon[1];
			this.pickerOriginX = defalutPositon[1];
			this.pickerY = defalutPositon[2];
			this.pickerOriginY = defalutPositon[2];
		});
	},
	methods: {
		/**
		 * 中间层方法 - 用来给统一处理手指事件
		 */
		bridgeFunction(e, funName) {
			if (!isAndroid()) e.preventDefault();
			this[funName](e);
		},
		/**
		 * 点击事件
		 */
		handleClick(el) {
			this.pickerX = el.offsetX;
			this.pickerY = el.offsetY;
		},
		handleStart(el) {
			this.pickerOriginX = this.pickerX;
			this.pickerOriginY = this.pickerY;
			this.pickerStartX = el.touches[0].pageX;
			this.pickerStartY = el.touches[0].pageY;
		},
		handleMove(el) {
			const moveX = el.touches[0].pageX - this.pickerStartX;
			const moveY = el.touches[0].pageY - this.pickerStartY;
			let left = this.pickerOriginX + moveX;
			let top = this.pickerOriginY + moveY;
			// 限制最大偏移量
			this.pickerX = left <= 0 ? 0 : left >= this.wrapperWidth ? this.wrapperWidth : left;
			this.pickerY = top <= 0 ? 0 : top >= this.wrapperHeight ? this.wrapperHeight : top;

		},
		handleEnd() {
			this.cursorOriginLeft = this.cursorX;
			this.pickerOriginX = this.pickerX;
			this.pickerOriginY = this.pickerY;
		},

		// 色阶柱
		handleThumb(el) {
			this.cursorX = el.offsetX;
		},
		handleCursorStart(el) {
			this.cursorStartX = el.touches[0].pageX;
		},
		handleCursorMove(el) {
			const moveX = el.touches[0].pageX - this.cursorStartX;
			const left = this.cursorOriginLeft + moveX;
			// 限制最大偏移量
			this.cursorX = left <= 0 ? 0 : left >= this.wrapperWidth ? this.wrapperWidth : left;
		},
		handleCursorEnd(el) {
			this.cursorOriginLeft = this.cursorX;
		},
		// 确定保存
		handleConfirm(value) {
			if (value) {
				this.$emit('confirm', { value: this.currentColor, type: 'picker', other: [ this.cursorX, this.pickerX, this.pickerY ] });
			} else {
				this.$emit('cancel');
			}
		}

	}
};
</script>

<style lang="scss" scoped>
.v-colors-picker {
    .v-picker-wrapper {
        .v-picker-colorbox {
             height: 255px;
			 position: relative;
			.v-picker-colorbox-white {
				position: absolute;
				top:0;
				left: 0;
				bottom: 0;
				right: 0;
				z-index: 1;
			}
			.v-picker-colorbox-black {
				position: absolute;
				top:0;
				left: 0;
				bottom: 0;
				right: 0;
				z-index: 1;
				background: linear-gradient(0deg, #000, transparent);
			}
        }
        .v-picker-round {
            position: absolute;
            width: 40px;
            height: 40px;
            border-radius: 100%;
            border: 4px solid #fff;
            z-index: 10;
            top: 0;
            left: 0;
        }
    }
    .v-picker-thumb {
        height: 24px;
        border-radius: 12px;
        background: linear-gradient(
            90deg,
            #f00 0,
            #ff0 17%,
            #0f0 33%,
            #0ff 50%,
            #00f 67%,
            #f0f 83%,
            #f00
        );

    }
    .v-picker-thumb-cursor {
        width: 36px;
        height: 36px;
        border-radius: 100%;
        position: absolute;
        border: 4px solid #fff;
        top: 6px;
        left: 0;
        z-index: 10;
        // transition: transform 0ms linear;
    }
}
</style>
