<template>
  <div class="preview-image-canvas-component">
    <div class="preview-warp">
      <div ref="container" style="overflow: hidden"></div>
    </div>

    <div class="operation-warp">
      <div
        class="operation-item"
        v-for="(item, index) in watermarkData"
        :key="item"
      >
        <div>水印{{ index + 1 }}</div>
        <div>类型: {{ item.type }}</div>
        <div>
          宽度：<input
            type="number"
            style="width: 40px"
            :value="item.size.width"
            @change="(e) => changeWidth(e, item, index)"
            @keyup.enter="(e) => changeWidth(e, item, index)"
          />
        </div>
        <div>
          高度：<input
            type="number"
            style="width: 40px"
            :value="item.size.height"
            @change="(e) => changeHeight(e, item, index)"
            @keyup.enter="(e) => changeHeight(e, item, index)"
          />
        </div>
        <div>
          左侧距离：<input
            type="number"
            style="width: 40px"
            :value="item.position.left"
            @change="(e) => changeLeft(e, item, index)"
            @keyup.enter="(e) => changeLeft(e, item, index)"
          />
        </div>
        <div>
          顶部距离：<input
            type="number"
            style="width: 40px"
            :value="item.position.top"
            @change="(e) => changeTop(e, item, index)"
            @keyup.enter="(e) => changeTop(e, item, index)"
          />
        </div>
      </div>

      <div>
        <button @click="affirm">确认</button>
      </div>
    </div>
  </div>
</template>

<script>
import { createCanvas } from "./utils";
export default {
  name: "ImageCanvas",
  props: {
    backgroundImg: String,
    watermark: Array,
    affirmFn: Function,
  },
  data: () => {
    return {
      backgroundImgUrl: "",
      watermarkData: [],
      oldCanvas: null,
    };
  },
  methods: {
    affirm: function () {
      this.affirmFn(this.watermarkData);
    },
    change: function (itemData, index) {
      this.watermarkData.splice(index, 1, itemData);
      this.renderCanvas();
    },
    changeWidth: function (e, itemData, index) {
      this.change(
        {
          ...itemData,
          size: {
            ...itemData.size,
            width: e.target.value,
          },
        },
        index
      );
    },
    changeHeight: function (e, itemData, index) {
      this.change(
        {
          ...itemData,
          size: {
            ...itemData.size,
            height: e.target.value,
          },
        },
        index
      );
    },
    changeLeft: function (e, itemData, index) {
      this.change(
        {
          ...itemData,
          position: {
            ...itemData.position,
            left: e.target.value,
          },
        },
        index
      );
    },
    changeTop: function (e, itemData, index) {
      this.change(
        {
          ...itemData,
          position: {
            ...itemData.position,
            top: e.target.value,
          },
        },
        index
      );
    },
    renderCanvas: function () {
      createCanvas(
        {
          backgroundImg: this.backgroundImgUrl,
          watermark: this.watermarkData || [],
          width: 800,
        },
        null,
        (canvas) => {
          if (this.oldCanvas) {
            this.$refs.container.removeChild(this.oldCanvas);
            this.$refs.container.append(canvas);
          } else {
            this.$refs.container.append(canvas);
          }
          this.oldCanvas = canvas;
          const transform = canvas.style.transform;
          const ratio = parseFloat(
            transform.substring(
              transform.indexOf("(") + 1,
              transform.indexOf(")")
            )
          );
          this.$refs.container.style.height = canvas.height * ratio + "px";
        }
      );
    },
  },
  mounted: function () {
    this.$nextTick(function () {
      this.backgroundImgUrl = this.backgroundImg;
      this.watermarkData = this.watermark;
      this.renderCanvas();
    });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.preview-image-canvas-component {
  display: flex;
  justify-content: space-between;
}
.preview-warp {
  width: 800px;
}
.operation-warp {
  width: 200px;
  flex: 1;
  margin-left: 16px;
}
.operation-item {
  border: 1px solid #ddd;
  margin-bottom: 12px;
  padding: 4px;
}
</style>
