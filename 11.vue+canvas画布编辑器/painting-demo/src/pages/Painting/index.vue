<template>
  <div class="container">
    <div class="btn">
      <van-button @click="changeType('painting')" type="primary"
        >画笔</van-button
      >
      <van-button @click="changeType('rect')" type="success">四边形</van-button>
      <van-button @click="changeType('arc')" type="warning">圆形</van-button>
      <van-button
        @click="changeType('color')"
        :style="{ background: activeColor }"
        >颜色</van-button
      >
      <van-button @click="clear" type="default">清空</van-button>
      <van-button @click="saveImg" type="danger">保存</van-button>
    </div>
    <canvas
      id="canvas"
      :width="sceneWith"
      :height="sceneHeight"
      class="scrollImg"
      @touchstart="canvasDown"
      @touchmove="canvasMove"
      @touchend="canvasUp"
      @touchcancel="canvasUp"
    />
    <van-action-sheet
      v-model:show="showColors"
      :closeable="false"
      :overlay="false"
      :safe-area-inset-bottom="false"
      @closed="colorClosed"
    >
      <ColorsPicker
        v-if="showColors"
        :position="colorPosition"
        @change="colorPickerChange"
        @confirm="handleMattingAction"
        @cancel="colorClosed"
      />
    </van-action-sheet>
  </div>
</template>

<script>
import ColorsPicker from '@/components/colors-picker';

export default {
  components: {
    ColorsPicker,
  },
  data () {
    return {
      showColors: false,
      activeColor: "rgba(210,80,44,1)", // 当前选中的颜色
      oldColor: "rgba(210,80,44,1)",
      colorPosition: [23, 297.12913513183594, 32.76922607421875], // 颜色选择器位置
      type: "",
      isDraw: false,
      canvasDom: null,
      ctx: null,
      beginX: 0,
      beginY: 0,
      color: "#000",
      imageData: null,
      sceneWith: document.documentElement.clientWidth - 2, // 画布宽度
      sceneHeight: document.documentElement.clientHeight - 58, // 画布高度
    };
  },
  mounted () {
    this.canvasDom = document.getElementById("canvas");
    this.ctx = this.canvasDom.getContext("2d");
  },
  beforeUnmount () {
  },
  methods: {
    // 顶部操作按钮
    changeType (val) {
      const options = {
        color: () => {
          this.showColors = true;
        },
        painting: () => {
          console.log('绘画');
        },
        rect: () => {
          console.log('画四边形');
        },
        arc: () => {
          console.log('画圆形');
        }
      };
      this.type = val;
      options[val] && options[val]();
    },
    /**
     * 动态改变颜色
     */
    colorPickerChange (color) {
      this.activeColor = color;
    },
    /**
     * 选择颜色块
     */
    handleMattingAction ({ value = '', type = null, other = null }) {
      other && (this.colorPosition = other || []);
      this.activeColor = value;
      this.oldColor = value;
      this.showColors = false;
    },
    colorClosed () {
      this.activeColor = this.oldColor;
      this.showColors = false;
    },
    // 清空
    clear () {
      this.imageData = null;
      this.ctx.clearRect(0, 0, this.sceneWith, this.sceneHeight);
    },
    // 移动端保存图片
    saveImg () {
      this.canvasDom.toBlob(function (blob) {
        const eleLink = document.createElement("a");
        eleLink.download = 'pic.png';
        // 字符内容转变成blob地址
        eleLink.href = URL.createObjectURL(blob);
        // 触发点击
        eleLink.click();
      }, 'image/png', 1);

    },
    // 画布操作
    canvasDown (e) {
      this.isDraw = true;
      const canvas = this.canvasDom;
      const { pageX, pageY } = e.targetTouches[0];
      this.beginX = pageX - canvas.offsetLeft;
      this.beginY = pageY - canvas.offsetTop;
      this.ctx.beginPath();
      // 画笔工具初始化处理
      if (this.type === 'painting') {
        this.patintInit();
      }
      // 利用阴影，消除锯齿
      this.ctx.shadowBlur = 1.1;// 线条阴影大小
      this.ctx.shadowColor = this.activeColor;// 线条阴影颜色
    },
    canvasMove (e) {
      if (!this.isDraw) return;
      const canvas = this.canvasDom;
      const ctx = this.ctx;
      const { pageX, pageY } = e.targetTouches[0];
      const x = pageX - canvas.offsetLeft;
      const y = pageY - canvas.offsetTop;
      this.operate(ctx, x, y);
    },
    canvasUp () {
      this.ctx.closePath();
      this.imageData = this.ctx.getImageData(0, 0, this.sceneWith, this.sceneHeight);
      this.isDraw = false;
    },
    // 三个类型操作
    operate (ctx, x, y) {
      const operateObj = {
        painting: () => {
          this.paintingHandle(ctx, x, y);
        },
        rect: () => {
          this.rectHandle(ctx, x, y);
        },
        arc: () => {
          this.arcHandle(ctx, x, y);
        }
      };
      operateObj[this.type] && operateObj[this.type]();
    },

    // 画笔初始化
    patintInit () {
      this.ctx.moveTo(this.beginX, this.beginY);
      this.ctx.strokeStyle = this.activeColor;
      this.ctx.lineWidth = this.lineWidth;
      this.ctx.lineCap = 'round'; // 线条末端添加圆形线帽，减少线条的生硬感
      this.ctx.lineJoin = 'round'; // 线条交汇时为原型边角
    },

    // 画笔操作
    paintingHandle (ctx, x, y) {
      ctx.lineTo(x, y);
      ctx.stroke();
    },

    // 画四边形
    rectHandle (ctx, x, y) {
      const beginX = this.beginX;
      const beginY = this.beginY;
      this.isDraw && ctx.clearRect(0, 0, this.sceneWith, this.sceneHeight);
      this.imageData && ctx.putImageData(this.imageData, 0, 0, 0, 0, this.sceneWith, this.sceneHeight);
      ctx.beginPath();
      ctx.strokeStyle = this.activeColor;

      ctx.rect(beginX, beginY, x - beginX, y - beginY);
      ctx.stroke();
      ctx.closePath();
    },

    // 画圆形
    arcHandle (ctx, x, y) {
      const beginX = this.beginX;
      const beginY = this.beginY;
      this.isDraw && ctx.clearRect(0, 0, this.sceneWith, this.sceneHeight);
      this.imageData && ctx.putImageData(this.imageData, 0, 0, 0, 0, this.sceneWith, this.sceneHeight);
      ctx.beginPath();
      ctx.strokeStyle = this.activeColor;
      ctx.arc(
        beginX,
        beginY,
        Math.round(
          Math.sqrt((x - beginX) * (x - beginX) + (y - beginY) * (y - beginY))
        ),
        0,
        2 * Math.PI
      );
      ctx.stroke();
      ctx.closePath();
    },
  }
};
</script>

<style lang="css" scoped>
.btn {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
#canvas {
  border: 1px solid black;
}
</style>
