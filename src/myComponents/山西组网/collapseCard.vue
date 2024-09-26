<template>
  <div class="collapse-card">
    <div
      class="title h-30px left-0 box-border flex flex-row justify-between items-center"
      @click="click"
    >
      <div style="font-size: 16px; color: rgb(78, 129, 184)">{{ title }}</div>
      <span v-show="showVal">{{ val }}</span>
      <el-switch
        v-show="showSelect"
        @click.stop
        v-model="select"
        inline-prompt
        :active-icon="Check"
        :inactive-icon="Close"
        :before-change="beforeChange"
        size="small"
      />
      <el-icon
        v-show="showCollapse"
        :class="`${show ? 'rotate-180deg' : 'rotate-0eg'}`"
        style="transition: all 300ms"
      >
        <svg
          t="1692335429583"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M64 320l64-64 384 384L896 256l64 64-448 448z"
            p-id="9959"
            data-spm-anchor-id="a313x.search_index.0.i4.4d423a814g60B1"
            class="selected"
          ></path>
        </svg>
      </el-icon>
    </div>
    <el-collapse-transition>
      <div v-show="show" class="collapse" style="flex-direction: column">
        <slot></slot>
      </div>
    </el-collapse-transition>
  </div>
</template>
<script lang="ts" setup>
import { computed } from "vue";
import { Check, Close } from "@element-plus/icons-vue";
const emit = defineEmits(["update:show", "update:select"]);
const click = () => {
  emit("update:show", !props.show);
};
interface propsType {
  title: string;
  show: boolean;
  select?: boolean;
  beforeChange?: (() => boolean | Promise<boolean>) | undefined;
  showSelect?: boolean;
  showCollapse?: boolean;
  val?: number;
  showVal?: boolean;
}
const props = withDefaults(defineProps<propsType>(), {
  title: "Title",
  show: true,
  testSelect: true,
  beforeChange: undefined,
  select: false,
  showCollapse: true,
  number: 0,
  showVal: false,
});
const select = computed({
  get() {
    return props.select;
  },
  set(val) {
    emit("update:select", val);
  },
});
</script>
