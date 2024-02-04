<template>
  <VueDraggable v-model="list" target=".sort-target" animation="150">
    <el-checkbox
      v-model="checkAll"
      :indeterminate="isIndeterminate"
      class="dark:bg-#2b2b2b bg-white"
      @change="allChange"
      :style="`
        position: sticky;
        top: 0;
        width: 100%;
        border-bottom: ${list.length > 0 ? '1px solid grey' : 'none'};
        box-sizing: border-box;
        padding: 0 10px;
        z-index: 100;`"
      >Check all</el-checkbox
    >
    <div class="sort-target flex flex-col" style="padding: 0 10px">
      <el-checkbox
        v-model="item.checked"
        v-for="(item, k) in list"
        :key="k"
        :label="item"
        >{{ item.Field }}</el-checkbox
      >
    </div>
  </VueDraggable>
</template>
<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { VueDraggable } from "vue-draggable-plus";
let props = withDefaults(
  defineProps<{
    list?: Array<any>;
  }>(),
  {
    list: () =>
      ref([
        {
          name: "test1",
          checked: true,
        },
        {
          name: "test2",
        },
        {
          name: "test3",
        },
        {
          name: "test4",
        },
      ]).value,
  }
);
const emit = defineEmits(["update:list"]);
const list = computed({
  get: () => {
    return props.list;
  },
  set: (val) => {
    emit("update:list", val);
  },
});

let allChecked = ref(true);
const checkAll = computed({
  set: (val) => {
    if (props.list.length === 0) {
      allChecked.value = val;
    }
  },
  get: () => {
    if (props.list.length === 0) {
      return allChecked.value;
    } else {
      return props.list.every((item) => {
        return item.checked;
      });
    }
  },
});
const isIndeterminate = computed(() => {
  let checked = props.list.some((item) => {
    return item.checked;
  });
  let unchecked = props.list.some((item) => {
    return !item.checked;
  });
  return checked && unchecked;
});
const allChange = (val: boolean) => {
  props.list.map((item) => {
    item.checked = val;
  });
};
</script>
<style>
.ep-checkbox__inner {
  transition: none;
}
</style>
