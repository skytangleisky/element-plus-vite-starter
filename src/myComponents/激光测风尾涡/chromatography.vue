<template>
  <div class="gradient" ref="gradientRef">
    <template v-for="(v, k) in arr.toReversed()">
      <div v-if="k !== arr.length - 1" class="section">
        <div class="division">{{ v }}</div>
      </div>
    </template>
    <div class="division">{{ arr.toReversed()[arr.length - 1] }}</div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
const orientation = "to top";
const getHue = (min: number, v: number, max: number) => {
  let value: number;
  if (v < min) {
    value = min;
  } else if (v > max) {
    value = max;
  } else {
    value = v;
  }
  //hsl(240,100%,50%)～hsl(180,100%,50%)hsl(60,100%,50%)～hsl(0,100%,50%)
  let percent = (v - min) / (max - min);
  return percent < 0.5 ? ((0.5 - percent) / 0.5) * 60 + 180 : ((1 - percent) / 0.5) * 60;
};
const props = withDefaults(defineProps<{ arr: Array<number> }>(), {
  arr: () => [0, 0.25, 0.5, 0.75, 1],
});
const colors: Array<{ percent: number; color: string }> = [];
const gradientRef = ref(null);
onMounted(() => {
  const gradient = (gradientRef.value as unknown) as HTMLDivElement;
  watch(
    () => props.arr,
    (arr) => {
      colors.length = 0;
      let min = Math.min(...props.arr);
      let max = Math.max(...props.arr);
      //渐变色标
      // props.arr.map((v, k) => {
      //   // let percent = (v - min) / (max - min);
      //   let percent = k / (props.arr.length - 1);
      //   colors.push({
      //     percent: percent,
      //     color: `hsl(${getHue(min, v, max)},100%,50%)`,
      //   });
      // });
      //色块色标
      for (let i = 1; i < props.arr.length; i++) {
        let pre = props.arr[i - 1];
        let cur = props.arr[i];
        // let percent1 = (pre - min) / (max - min);
        // let percent2 = (cur - min) / (max - min);
        let percent1 = (i - 1) / (props.arr.length - 1);
        let percent2 = i / (props.arr.length - 1);
        let avg = (getHue(min, pre, max) + getHue(min, cur, max)) / 2;
        let color = `hsl(${avg},100%,50%)`;
        colors.push({ percent: percent1, color });
        colors.push({ percent: percent2, color });
      }
      if (colors.length > 0) {
        gradient.style.setProperty(
          "--gradient",
          `linear-gradient( ${orientation}, ${colors
            .map((item) => item.color + " " + item.percent * 100 + "%")
            .join(", ")})`
        );
        gradient.style.setProperty("display", "flex");
      } else {
        gradient.style.setProperty("--gradient", "unset");
        gradient.style.setProperty("display", "none");
      }
    },
    { immediate: true }
  );
});
defineExpose({
  getColor: (v: number) => {
    let min = Math.min(...props.arr);
    let max = Math.max(...props.arr);
    return `hsl(${getHue(min, v, max)},100%,50%)`;
  },
});
</script>
<style scoped lang="scss">
.gradient {
  --gradient: unset;
  position: absolute;
  right: 0;
  top: 0;
  width: 20px;
  height: 100%;
  // border: 1px solid red;
  box-sizing: border-box;
  background: var(--gradient, linear-gradient(to top, #f00, #0f0, #00f));
  display: flex;
  flex-direction: column;
  .section {
    position: relative;
    height: 100%;
    &:hover {
      outline: 2px solid lightgray;
    }
    .division {
      color: var(--ep-text-color-primary);
      top: 0;
      position: absolute;
      left: calc(100% + 4px);
      transform: translateY(-50%);
    }
  }
  .division {
    color: var(--ep-text-color-primary);
    top: 100%;
    transform: translateY(-50%);
    position: absolute;
    left: calc(100% + 4px);
  }
}
</style>
