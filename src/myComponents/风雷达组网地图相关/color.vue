<template>
  <div class="color">
    <div class="module-title" >{{ title }}</div>
    <div class="colors">
      <template
        v-if="type=='category'"
      >
        <div
          v-for="(v, key) in colors"
          :key="key"
          :style="`background:${v};width: ${100/values.length}%;;height:20px;`"
        ></div>
      </template>
      <div v-else style="width: 100%; height: 20px; background: linear-gradient(to right, #3288bd, #e6f598 50%, #d53e4f);"></div>
    </div>
    <div class="values">
      <template
        v-for="(v, key) in values"
        :key="key"
      >
        <div
          v-if="type=='category'"
          :style="`
            font-weight: 700;
            width: ${100/values.length}%;
            height: 20px;
            line-height: 25px;
            text-align: center;
            vertical-align: top;
            font-size: 12px;
          `"
        >
          {{ v }}
        </div>
        <div v-else>
          {{ v }}
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import { getColor } from '~/tools';
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
          type:'category',
          describe: "fkx|ppi风羽|ppi风矢",
          colors: [
            getColor(1),
            getColor(2),
            getColor(4),
            getColor(6),
            getColor(8),
            getColor(10),
            getColor(12),
            getColor(14),
            getColor(16),
            getColor(18),
            getColor(20)
          ],
          values: [0, 1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
        },
        径向风: {
          type:'category',
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
          type:'category',
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
          type:'category',
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
          type:'category',
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
        流线: {
          type:'category',
          colors: [
            '#3288bd',
            '#66c2a5',
            '#abdda4',
            '#e6f598',
            '#fee08b',
            '#fdae61',
            '#f46d43',
            '#d53e4f',
          ],
          values: [
            0.0*20,
            0.1*20,
            0.2*20,
            0.3*20,
            0.4*20,
            0.5*20,
            0.6*20,
            1.0*20,
          ],
        },
        等值线: {
          colors: [
            '#3288bd',
            '#e6f598',
            '#d53e4f',
          ],
          values: [
            -3,0,3
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
    type(){
      return this.options[this.demo].type;
    }
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
    justify-content: space-between;
    align-items: center;
  }
}
</style>
