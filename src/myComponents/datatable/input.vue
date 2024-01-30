<template>
  <input
    class="input"
    type="text"
    :value="props.item[props.k]"
    @input="inputValue"
    placeholder="请输入数据"
  />
</template>
<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    k: string;
    item: any;
    change: Function;
  }>(),
  {
    k: "",
    item: {},
    change: function () {},
  }
);
const emit = defineEmits(["update:item"]);
const inputValue = (event: any) => {
  let oldVal = props.item[props.k];
  props.item[props.k] = event.target.value;
  emit("update:item", props.item);
  props.change(props.item, props.k, oldVal);
};
</script>
<style scoped lang="scss">
.input {
  width: 100%;
  min-width: 150px;
  box-sizing: border-box;
  border: 2px solid transparent;
  &:focus-visible {
    border-radius: 4px;
    border: 2px solid #a3c7fa;
    outline: none;
  }
}
</style>
