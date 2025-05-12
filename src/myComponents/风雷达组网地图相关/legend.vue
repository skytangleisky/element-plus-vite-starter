<template>
  <div @click="click" class="legendContainer">
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
  width: 48px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  color: black;
  background:var(--bg-color-overlay-opacity-8);

  border-radius: 4px;
  cursor: pointer;
  user-select: none;
  & > div {
    left: 0px;
    padding: 8px;
    bottom: calc(100% + 10px);
    position: absolute;
    border-radius: 8px;
    background: var(--bg-color-overlay-opacity-8);
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
