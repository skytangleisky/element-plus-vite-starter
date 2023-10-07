<template>
  <div @click="click" class="legendContainer absolute bg-light">
    <div v-show="show" @click.stop ref="legend">test</div>
    <span>图例</span>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
const show = ref(true);
const click = () => {
  show.value = !show.value;
};
</script>
<style lang="scss">
// .legend {
//   position: absolute;
//   bottom: 20px;
//   left: 20px;
//   padding: 10px;
//   border-radius: 4px;
//   cursor: pointer;
// }
.legendContainer {
  color: black;
  background: white;
  position: absolute;
  bottom: 40px;
  left: 20px;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
  box-shadow: 0px 0px 6px 1px #00000044;
  & > div {
    left: 0px;
    padding: 8px;
    bottom: calc(100% + 10px);
    position: absolute;
    border-radius: 8px;
    background: white;
    box-shadow: 0px 0px 6px 1px #00000044;
    cursor: auto;
    &:empty {
      background: red;
    }
  }
}
</style>
