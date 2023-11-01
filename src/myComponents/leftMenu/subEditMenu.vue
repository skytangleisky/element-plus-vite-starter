<template>
  <li
    v-for="item in json"
    class="dd-item"
    :data-id="item.id"
    :data-item="JSON.stringify(item)"
  >
    <div class="dd-handle">
      <el-icon v-dompurify-html="format(item.svg)" style="font-size: 1rem"></el-icon>
      <span>{{ item.id }}</span>
      <i class="b-var(--text-primary-color)-1px b-solid">{{ item.path }}</i>
      <span>{{ item.component }}</span>
    </div>
    <ol v-if="item.children" class="dd-list">
      <subEditMenu :json="item.children"></subEditMenu>
    </ol>
  </li>
</template>
<script lang="ts" setup>
const { json } = defineProps({
  json: {
    type: Array,
    default: [],
  },
});
import { useIconStore } from "~/stores/icon";
const icon = useIconStore();
const format = (svg: string) => {
  let res = icon.results.filter((it) => it.uuid == svg);
  if (res.length <= 0) {
    return "";
  } else if (res.length == 1) {
    return res[0].svg;
  } else {
    throw Error("uuid duplication!");
  }
};
</script>
<style lang="scss"></style>
