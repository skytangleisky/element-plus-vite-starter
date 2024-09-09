<template>
  <div>
    <TreeNode
      v-for="node in treeData"
      :key="node.id"
      :node="node"
      @update:checked="handleCheck"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import TreeNode from './TreeNode.vue';

const treeData = ref([
  {
    id: 1,
    label: '节点1',
    checked: false,
    indeterminate: false,
    children: [
      {
        id: 2,
        label: '节点1-1',
        checked: false,
        indeterminate: false,
        children: [],
      },
      {
        id: 3,
        label: '节点1-2',
        checked: false,
        indeterminate: false,
        children: [
          {
            id: 4,
            label: '节点1-2-1',
            checked: false,
            indeterminate: false,
            children: [
              {
              id: 1211,
              label: '节点1-2-1-1',
              checked: false,
              indeterminate: false,
              }
            ],
          },
          {
            id: 4,
            label: '节点1-2-2',
            checked: false,
            indeterminate: false,
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: 5,
    label: '节点2',
    checked: false,
    indeterminate: false,
    children: [],
  },
]);

const handleCheck = (id, checked) => {
  // 在这里可以处理全局选中状态，例如记录选中的节点
  console.log(`节点 ${id} 被 ${checked ? '选中' : '取消选中'}`);
};
</script>
