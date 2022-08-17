import { ref } from "vue";

/**
 * 双指缩放
 */
let distance = ref(0); // 双指初始距离
let stepSizeX = ref(0); // 缩放的初始值 x
let stepSizeY = ref(0); // 缩放的初始值 y
let isBothMove = ref(false); // 是否正在双指缩放
let closeMoveNum = ref(0);

/**
 * 文字放大缩小 - 开始
 * step: 字体的基准值,缩放将以这个值为基准来进行倍数的缩放
 */
const handleTouchStart = (e, stepX, stepY = 0) => {
	if (e.touches.length === 2) {
		const { touches } = e;
		isBothMove.value = true;
		distance.value = Math.sqrt(
			(touches[0].clientX - touches[1].clientX) ** 2 +
      (touches[0].clientY - touches[1].clientY) ** 2
		);
		stepSizeX.value = stepX;
		stepSizeY.value = stepY;
	}
};
/**
 * 文字放大缩小 - 移动中
 * reveal: 兜底值 (在单指执行的时候,应该返回这个兜底值,不影响物体大小)
 *    需要的场景: 先双指运动放大物体,然后放开一根手指,此时成了单指,然后返回的是 stepSizeX,这是不合理的,因为之前已经放大了,
 *    再返回 stepSizeX 出现的现象就是: 双指放大后放开一根手指再移动会将物体大小又变为初始值
 */
const handleTouchMove = (e, revealX, revealY) => {
	if (e.touches.length === 2) {
		isBothMove.value = true;
		const { touches } = e;
		const selfDistance = Math.sqrt(
			(touches[0].clientX - touches[1].clientX) ** 2 +
      (touches[0].clientY - touches[1].clientY) ** 2
		);
		const scale = selfDistance / distance.value;
		return { scale, valueX: stepSizeX.value * scale, valueY: stepSizeY.value * scale };
	}
	return { scale: 1, valueX: revealX || stepSizeX.value, valueY: revealY || stepSizeY.value };
};
/**
 * 文字放大缩小 - 移动结束
 */
const handleTouchEnd = () => {
	// 这边为什么要做这种处理:
	// 这里只限制为双指的场景下
	// 如果不加入 closeMoveNum 这个变量,直接设置 isBothMove = false 来通知子组件
	// 且当前双指都在子组件内的情况下, 会导致子组件(文本框)发生移位的bug
	// 出现这样的移位是在于,文本框组件会触发两次 touchend情况,因为双指放开不是同一个事件,会触发两次,不可能那么精准俩个手指一起放开
	// 所以在这边设置,只有触发了两次这个end方法,才可以真正起效果
	if (isBothMove.value) {
		if (closeMoveNum.value === 1) {
			isBothMove.value = false;
			closeMoveNum.value = 0;
			// this.$point('TEXTMARK_ADJUST_STYLE');
		} else {
			closeMoveNum.value++;
		}
	}
};

export {
	isBothMove,
	handleTouchStart,
	handleTouchMove,
	handleTouchEnd
};