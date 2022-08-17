<template>
	<div class="custom-tips">
		<div class="hidden-line">
			<van-popover  placement="top-start" v-model:show="showPopover">
				<div class="tips" style="padding:0.3rem">
					<div class="tips-content" @click.stop="showTipsDetail()">
						{{ tipsTitle }}
					</div>
					<div class="close" @click.stop="closeTips()">
						关闭
					</div>
				</div>
				<template #reference>
					<div/>
				</template>
			</van-popover>
		</div>
		<van-action-sheet
			v-model:show="showTipsPopup"
			:closeable="true"
			:safe-area-inset-bottom="false"
			:title="popTitle"
			teleport="body"
			:lock-scroll="false"
			@closed="tipsPopupClosed">
			<div class="demo" style="overflow:auto">
				<slot/>
			</div>
		</van-action-sheet>
	</div>
</template>

<script>

export default {
	name: 'custom-tips',
	data() {
		return {
			showPopover: false,
			showTipsPopup: false,
		};
	},
	props: {
		tipsTitle: { type: String },

		popTitle: { type: String },
		times: { type: String }

	},
	mounted() {
		setTimeout(() => {
			this.showPopover = true;
		}, this.times || 2000);
	},
	methods: {
		tipsPopupClosed() {
			this.showTipsDetail = false;
			this.showTipsPopup = false;
			this.showMatting = true;
		},
		showTipsDetail() {
			this.showPopover = false;
			this.showTipsPopup = true;
		},
		closeTips() {
			this.showPopover = false;
			this.showTipsPopup = false;
		}
	}
};
</script>

<style lang="scss" scoped>
.custom-tips {
	font-size: 24px;
	.hidden-line{
		padding-left: 1rem;
		height: 0px;
		overflow: hidden;
		position: relative;
		top: -0.8rem;
	}
}
.tips{
		display: flex;
		background: #3D7FFF;
		border-color:#3D7FFF;
		font-size:24px;
		.tips-content{
			margin-right: 0.5rem;
			color: #FFFFFF;
		}
		.close{
			color: #FFFFFF;
			opacity: 0.5;
			padding: 0 0.4rem;
		}
	}
</style>
<style>
.van-popover__arrow{
	border-top-color: #3D7FFF!important;
}
</style>
