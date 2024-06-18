<template>
  <div class="color">
    <div
      style="
        border-left: 3px solid #128aed;
        box-sizing: border-box;
        font-size: 16px;
        margin-bottom: 10px;
      "
    >
      &emsp;{{ title }}
    </div>
    <div class="colors">
      <div
        v-for="(v, key) in colors"
        :key="key"
        :style="'background:' + v + ';width:18px;height:18px;margin:.5px;'"
      ></div>
    </div>
    <div class="values">
      <div
        v-for="(v, key) in values"
        :key="key"
        style="
          font-weight: 700;
          width: 19px;
          height: 18px;
          text-align: center;
          vertical-align: top;
          line-height: 18px;
          font-size: 10px;
        "
      >
        {{ v }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      default: "标题",
      type: String,
    },
    demo: {
      default: "风速",
      type: String,
    },
  },
  data() {
    return {
      options: {
        风速: {
          describe: "fkx|ppi风羽|ppi风矢",
          colors: [
            "#0000ff",
            "#002aff",
            "#0054ff",
            "#007eff",
            "#00a8ff",
            "#00d2ff",
            "#14d474",
            "#a6dd00",
            "#ffe600",
            "#ffb300",
            "#ff8000",
            "#ff4d00",
            "#ff1a00",
            "#e60000",
            "#b30000",
          ],
          values: [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60],
        },
        径向风: {
          colors: [
            "#0000ff",
            "#0033ff",
            "#0066ff",
            "#0099ff",
            "#00ccff",
            "#78ffff",
            "#dcffb4",
            "#ffff50",
            "#ffe600",
            "#ffb300",
            "#ff8000",
            "#ff4d00",
            "#ff1a00",
            "#e60000",
            "#b30000",
          ],
          values: [
            -60,
            -48,
            -40,
            -32,
            -24,
            -16,
            -8,
            -0.5,
            0.5,
            8,
            16,
            24,
            32,
            40,
            48,
            60,
          ],
        },
        谱宽: {
          colors: [
            "#0000ff",
            "#003fff",
            "#007eff",
            "#00bdff",
            "#14d474",
            "#a6dd00",
            "#ffe600",
            "#ff8c00",
            "#ff3200",
            "#d70000",
          ],
          values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        },
        信噪比: {
          colors: [
            "#0000ff",
            "#003fff",
            "#007eff",
            "#00bdff",
            "#14d474",
            "#a6dd00",
            "#ffe600",
            "#ff8c00",
            "#ff3200",
            "#d70000",
          ],
          values: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
        },
        频谱强度: {
          colors: [
            "#0000ff",
            "#001cff",
            "#0038ff",
            "#0054ff",
            "#0070ff",
            "#008cff",
            "#00a8ff",
            "#00c4ff",
            "#00e0ff",
            "#14d474",
            "#a6dd00",
            "#ffe600",
            "#ffbf00",
            "#ff9800",
            "#ff7100",
            "#ff4a00",
            "#ff2300",
            "#fb0000",
            "#d40000",
            "#ad0000",
          ],
          values: [
            0,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            19,
            20,
          ],
        },
      },
    };
  },
  computed: {
    colors() {
      return this.options[this.demo].colors;
    },
    values() {
      return this.options[this.demo].values;
    },
  },
};
</script>
<style scoped lang="scss">
.color {
  display: flex;
  flex-direction: column;
  z-index: 1000;
  .colors {
    display: inline-flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .values {
    display: inline-flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
}
</style>
