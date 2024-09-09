<template>
  <div class="tree-node">
    <input
      type="checkbox"
      :checked="node.checked"
      :indeterminate.prop="node.indeterminate"
      @change="onCheckChange($event.target.checked)"
    />
    <span>{{ node.label }}</span>
    <div v-if="node.children && node.children.length">
      <TreeNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        @update:checked="updateChildChecked"
      />
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const {node} = defineProps({
  node: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['update:checked']);

const onCheckChange = (checked) => {
  node.checked = checked;
  node.indeterminate = false;
  if (node.children && node.children.length) {
    node.children.forEach((child) => {
      setChildChecked(child, checked);
    });
  }
  emit('update:checked', node.id, node.checked);
};

const setChildChecked = (child, checked) => {
  child.checked = checked;
  child.indeterminate = false;
  if (child.children && child.children.length) {
    child.children.forEach((subChild) => {
      setChildChecked(subChild, checked);
    });
  }
};

const updateChildChecked = () => {
  if (!node.children || !node.children.length) return;

  const allChecked = node.children.every((child) => child.checked);
  const noneChecked = node.children.every((child) => !child.checked && !child.indeterminate);

  if (allChecked) {
    node.checked = true;
    node.indeterminate = false;
  } else if (noneChecked) {
    node.checked = false;
    node.indeterminate = false;
  } else {
    node.checked = false;
    node.indeterminate = true;
  }

  emit('update:checked', node.id, node.checked);
};
</script>

<style scoped>
.tree-node {
  margin-left: 0px;
  display: flex;
  align-items: start;
}

.tree-node span {
  margin-left: 8px;
}
</style>
