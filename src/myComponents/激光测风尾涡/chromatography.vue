<template>
  <div class="gradient" ref="gradientRef">
    <template v-for="(v, k) in arr.slice().reverse()">
      <div v-if="k !== arr.length - 1" class="section">
        <div class="division">{{ v }}</div>
      </div>
    </template>
    <div class="division">{{ arr.slice().reverse()[arr.length - 1] }}</div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
const orientation = "to top";
const getHue = (percent: number) => {
  if (percent < 0 || percent > 1) {
    throw Error("percent should be between 0 adn 1");
  }
  //hsl(240,100%,50%)～hsl(180,100%,50%)hsl(60,100%,50%)～hsl(0,100%,50%)
  return percent < 0.5 ? ((0.5 - percent) / 0.5) * 60 + 180 : ((1 - percent) / 0.5) * 60;
};
let arr = [-5, -4, -3, -2, -1, -0.5, 0, 0.5, 1, 2, 3, 4, 5];
const colors: Array<{ percent: number; color: string }> = [];
let min = Math.min(...arr);
let range = Math.max(...arr) - min;
// arr.map((v, k) => {
//   let percent = (v - min) / range;
//   colors.push({
//     percent: k / (arr.length - 1),
//     color: `hsl(${getHue(percent)},100%,50%)`,
//   });
// });
for (let i = 1; i < arr.length; i++) {
  let pre = arr[i - 1];
  let cur = arr[i];
  let percent1 = (pre - min) / range;
  let percent2 = (cur - min) / range;
  let avg = (getHue(percent1) + getHue(percent2)) / 2;
  let color = `hsl(${avg},100%,50%)`;
  colors.push({ percent: (i - 1) / (arr.length - 1), color });
  colors.push({ percent: i / (arr.length - 1), color });
}
const gradientRef = ref(null);
onMounted(() => {
  const gradient = (gradientRef.value as unknown) as HTMLDivElement;
  if (colors.length > 0) {
    gradient.style.setProperty(
      "--gradient",
      `linear-gradient( ${orientation}, ${colors
        .map((item) => item.color + " " + item.percent * 100 + "%")
        .join(", ")})`
    );
  } else {
    gradient.style.setProperty("--gradient", "unset");
  }
});
</script>
<style scoped lang="scss">
.gradient {
  --gradient: unset;
  position: absolute;
  left: 750px;
  top: 300px;
  width: 40px;
  height: 400px;
  // border: 1px solid red;
  box-sizing: border-box;
  background: var(--gradient, linear-gradient(to top, #f00, #0f0, #00f));
  display: flex;
  flex-direction: column;
  color: black;
  .section {
    position: relative;
    height: 100%;
    &:hover {
      outline: 2px solid black;
    }
    .division {
      top: 0;
      position: absolute;
      left: calc(100% + 4px);
      transform: translateY(-50%);
    }
  }
  .division {
    top: 100%;
    transform: translateY(-50%);
    position: absolute;
    left: calc(100% + 4px);
  }
}
</style>
