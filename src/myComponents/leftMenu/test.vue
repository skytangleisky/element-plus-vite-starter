<template>
  <div class="h-full box-border tree" style="border:1px solid red;">
    <VueDraggable tag="ul" v-model="treeData" group="gp">
      <NestedCheckbox :node="treeData" @change="handleChange">
        <template #item="{data,change}">
          <div class="flex items-center item">
            <el-icon  v-if="data.children" :class="`${data.expand?'':'collapsed'}`" style="position: absolute;width: 30px;height: 30px;left: 0;display: flex;align-items: center;justify-content: center;">
              <div class="dd-collapse cross" style="position: absolute;width: 30px;height: 30px;left: 0;display: flex;align-items: center;justify-content: center;">
              <div style="width: 10px;height: 10px;border-radius: 50%;background: white;z-index: 1;border:1px solid black;" @click="data.expand=!data.expand"></div>
                <svg viewBox="0 0 200 200" style="width:8px;height:8px;position:absolute;z-index:1;pointer-events: none;">
                    <path id="morph" fill="black" />
                </svg>
              </div>
            </el-icon>
            <input
              type="checkbox"
              :checked="data.checked"
              :indeterminate="data.indeterminate"
              @change="change"
            />
            <span class="color-white">{{ data.label }}</span>
          </div>
        </template>
      </NestedCheckbox>
    </VueDraggable>
  </div>
</template>

<script lang="ts" setup>
import { ref,watch } from 'vue';
import { VueDraggable } from '../../../packages/vue-draggable-plus/component'
import NestedCheckbox from './NestedCheckbox.vue';

// 定义树节点接口
interface TreeNode {
  label: string;
  checked?: boolean;
  indeterminate?: boolean;
  children?: TreeNode[];
  parent?: TreeNode;
}

// 初始数据
const treeData = ref<TreeNode>({
  label: 'Root',
  children: [
    {
      label: 'Node 1',
      children: [
        { label: 'Node 1.1', checked: false },
        { label: 'Node 1.2', checked: false },
      ],
    },
    {
      label: 'Node 2',
      children: [
        { label: 'Node 2.1',children:[
            { label: 'Node 2.1.1',
              children:[
                { label: 'Node 2.1.1.1', checked: true },
                { label: 'Node 2.1.1.2', checked: false },
              ]
            },
            { label: 'Node 2.1.2', checked: false },
          ]
        },
        { label: 'Node 2.2', checked: false },
      ],
    },
  ],
});

const initializeState = (node: TreeNode) => {
  if (node.children && node.children.length > 0) {
    node.children.forEach((child) => {
      child.parent = node; // 设置父节点引用
      initializeState(child); // 递归处理子节点
    });

    const allChecked = node.children.every((child) => child.checked === true);
    const allUnchecked = node.children.every((child) => !child.checked && !child.indeterminate);

    node.checked = allChecked;
    node.indeterminate = !allChecked && !allUnchecked;
  } else {
    // 默认未选中的叶子节点
    node.checked = node.checked ?? false;
    node.indeterminate = false;
  }
};
watch(()=>treeData,()=>{
  initializeState(treeData.value)
},{deep:true,immediate:true})

// 处理变化事件
const handleChange = (node: TreeNode) => {
  console.log('节点状态更新:', node);
};
</script>
<style lang="scss">
.tree{
  .item{
    height: 30px;
    border:1px solid red;
    box-sizing: border-box;
    .cross{
      cursor: pointer;
      z-index: 1;
      #morph {
        d: path("M0,75 L200,75 200,125 0,125z");
      }
    }
    .collapsed>.cross{
      #morph {
        d: path("M75,0 L125,0 125,75 200,75 200,125 125,125 125,200 75,200 75,125 0,125 0,75 75,75z");
      }
    }
  }
  ul{
    margin: 0;
    padding-left: 0px;
    list-style: none;
    position: relative;
  }
  li {
    position: relative;
    padding-left: 30px;
    box-sizing: border-box;
    width: 100%;
    &::before,&::after {
      content: '';
      position: absolute;
      left: 0;
      border-color: #888;
      border-style: solid;
    }

    &::before {
      top: 0;
      left: 15px;
      width: 15px;
      height: 100%;
      border-width: 0 0 0 1px;
    }

    &::after {
      top: 15px;
      left: 15px;
      width: 15px;
      height: 15px;
      border-width: 1px 0 0 0;
    }

    &:last-child::before {
      height: 15px;
    }
  }
}
</style>