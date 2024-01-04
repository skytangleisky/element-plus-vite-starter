<template>
  <div @click="click" class="legendContainer absolute bg-light">
    <div v-show="setting.legend" @click.stop ref="legend">
      <color title="风速(m/s)" demo="风速"></color>
      <hr />
      <features title="要素填图"></features>
    </div>
    <span>图例</span>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import color from "./color.vue";
import features from "./features.vue";
import { useSettingStore } from "~/stores/setting";
const setting = useSettingStore();
const click = () => {
  setting.legend = !setting.legend;
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
  bottom: 10px;
  left: 10px;
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
.dark .legendContainer {
  background-color: #304156;
  color: #fff;
  hr {
    border-color: #00000044;
  }
  & > div {
    background: #304156;
  }
}
</style>
