<template>
  <fieldset class="b-solid b-1px rounded-lg">
    <legend class="font-size-20px">地图设置</legend>
    <div style="display: flex; justify-content: flex-start; flex-wrap: wrap">
      <div
        v-for="(v, k) of props.list"
        class="relative flex flex-col items-center w-50% box-border p-4px"
        @click="click(v, k, props.list)"
      >
        <img
          :src="v.url"
          class="dark:b-#888 b-solid b-1px b-#ddd"
          style="
            border-radius: 8px;
            width: 100%;
            box-sizing: border-box;
            -webkit-user-drag: none;
          "
        />
        <el-icon
          class="checkColor dark:bg-#fff b-solid bg-#000"
          v-if="v.selected"
          v-html="checkSvg"
          style="
            position: absolute;
            font-size: 1.5rem;
            right: 5px;
            top: 5px;
            border-radius: 50%;
          "
        ></el-icon>
        <span>{{ v.name }}</span>
      </div>
    </div>
  </fieldset>
</template>
<script lang="ts" setup>
import checkSvg from "~/assets/check.svg?raw";
const props = withDefaults(defineProps<{ list?: Array<any> }>(), {
  list: () => new Array<any>(),
});
const click = (v: any, k: number, list: any) => {
  list.map((item: any) => {
    if (item !== v) {
      item.selected = false;
    }
  });
  v.selected = true;
};
</script>
<style lang="scss">
.checkColor {
  color: #fff;
  filter: drop-shadow(0 0 2px #00000066);
}
.dark .checkColor {
  color: #2b2b2b;
  filter: drop-shadow(0 0 2px #ffffff66);
}
</style>
