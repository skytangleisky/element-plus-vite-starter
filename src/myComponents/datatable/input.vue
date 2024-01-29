<template>
  <input
    class="input"
    type="text"
    :value="props.value"
    @input="inputValue"
    placeholder="请输入数据"
  />
</template>
<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    value: string | undefined;
  }>(),
  {
    value: "",
  }
);
const emit = defineEmits(["update:value"]);
const inputValue = (event: any) => {
  emit("update:value", event.target.value);
};
</script>
<style scoped lang="scss">
.input {
  width: auto;
  border: 1px solid transparent;
}
</style>
