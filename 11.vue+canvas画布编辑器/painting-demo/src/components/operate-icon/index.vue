<template>
	<i
		:class="['cjxq_iconfont',name]"
		:style="`font-size:${size}; color:${color};`"
	/>
</template>

<script>
export default {
	props: {
		name: { // 图标名称
			type: String,
			require: true,
		},
		color: { // 图标颜色
			type: String,
			default: "#000"
		},
		size: { // 图标大小
			type: [String, Number],
			default: "24px"
		}
	},
};
</script>
