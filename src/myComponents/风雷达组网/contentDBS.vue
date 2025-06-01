<template>
  <div style="height: 100%;display: flex;flex-direction: column;">
    <div style="height: 100%; overflow: auto;width: 100%;box-sizing: border-box;position: relative;display: flex;;">
      <div style="padding:10px">
        <div
          style="border-radius: 10px; overflow: auto;width: 250px;background-color: white;height: 100%;box-sizing: border-box;border:1px solid gray;"
          v-loading="loading"
        >
          <el-tree
            :default-expand-all="true"
            ref="treeRef"
            node-key="id"
            lazy
            :load="loadNode"
            :render-content="renderContent"
            :props="defaultProps"
            @node-click="handleNodeClick"
            style="min-width: max-content"
            highlight-current
            empty-text=""
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>

</script>
<style lang="scss"></style>
