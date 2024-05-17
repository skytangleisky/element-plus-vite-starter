<template>
  <input
    class="input"
    type="text"
    :name="props.k"
    :value="props.item[props.k]"
    @input="inputValue"
    @focusin="focusin"
    @focusout="focusout"
    :placeholder="props.item['placeholder'] || '请输入数据'"
  />
</template>
<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    k: string;
    item: any;
    change: Function;
    focusin?: Function;
    focusout?: Function;
  }>(),
  {
    k: "",
    item: {},
    change: function () {},
    focusin: function () {},
    focusout: function () {},
  }
);
const emit = defineEmits(["update:item"]);
const inputValue = (event: any) => {
  let oldVal = props.item[props.k];
  props.item[props.k] = event.target.value;
  emit("update:item", props.item);
  props.change(props.item, props.k, oldVal);
};
const focusin = (event: any) => {
  props.focusin(props.item, props.k);
};
const focusout = (event: any) => {
  props.focusout(props.item, props.k);
};
</script>
<style scoped lang="scss">
.input {
  background: transparent;
  width: 100%;
  box-sizing: border-box;
  border: 2px solid transparent;
  color: inherit;
  &:focus-visible {
    border-radius: 4px;
    border: 2px solid #a3c7fa;
    outline: none;
  }
}
</style>
