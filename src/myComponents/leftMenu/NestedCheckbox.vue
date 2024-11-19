<template>
  <li>
    <slot
      name="item"
      :data="node"
      :change="change">
      <input
        type="checkbox"
        :checked="checked"
        :indeterminate="indeterminate"
        @change="change"
      />
      <span>{{ node.label }}</span>
    </slot>
    <VueDraggable v-model="node.children" :class="`drag-area ${node.expand?'':'collapsed'}`" :style="`interpolate-size: allow-keywords;transition:height 0.3s;transition-timing-function:ease-in-out;overflow: hidden;padding:0;height: ${node.expand?'auto':'0px'}`" tag="ul" group="gp">
      <NestedCheckbox
        v-for="(child, index) in node.children"
        :key="index"
        :node="child"
        @change="$emit('change', $event)"
      >
        <template #item="{data,change}:any">
          <slot
            name="item"
            :data="data"
            :change="change">
          </slot>
        </template>
      </NestedCheckbox>
    </VueDraggable>
  </li>
</template>
<script lang="ts">

import { VueDraggable } from '../../../packages/vue-draggable-plus/component'
// 定义树节点接口
interface TreeNode {
  expand:boolean;
  label: string;
  checked: boolean;
  indeterminate: boolean;
  children?: TreeNode[];
}
import { defineComponent, ref, watch, PropType } from 'vue';

export default defineComponent({
  name: 'NestedCheckbox',
  props: {
    node: {
      type: Object as PropType<TreeNode>,
      required: true,
    },
    parent: {
      type: Object as PropType<TreeNode>,
      required: false,
    }
  },
  emits: ['change'],
  setup(props, { emit }) {
    const checked = ref(props.node.checked);
    const indeterminate = ref(props.node.indeterminate);

    // 更新当前节点及其所有子节点的状态
    const updateChildrenState = (node: TreeNode, checkedState: boolean) => {
      node.checked = checkedState;
      node.indeterminate = false;
      node.children?.forEach((child) => updateChildrenState(child, checkedState));
    };

    // 更新父节点状态
    const updateParentState = (parent: TreeNode | undefined) => {
      if (parent) {
        const allChecked = parent.children?.every((child) => child.checked) ?? false;
        const allUnchecked = parent.children?.every((child) => !child.checked && !child.indeterminate) ?? false;
        parent.checked = allChecked;
        parent.indeterminate = !allChecked && !allUnchecked;
      }
    };

    // 切换当前节点状态
    const change = () => {
      checked.value = !checked.value;
      indeterminate.value = false;
      updateChildrenState(props.node, checked.value);
      updateParentState(props.parent);
      emit('change', props.node);
    };

    watch(
      () => [props.node.checked, props.node.indeterminate],
      ([newChecked, newIndeterminate]) => {
        checked.value = newChecked;
        indeterminate.value = newIndeterminate;
      },
      { immediate: true }
    );

    return {
      checked,
      indeterminate,
      change,
    };
  },
  components:{
    VueDraggable
  }
});
</script>