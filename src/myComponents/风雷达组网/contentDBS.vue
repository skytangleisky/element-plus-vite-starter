<template>
  <div class="h-full flex flex-col">
    <div class="w-full box-border relative flex" style="height: 100%; overflow: auto">
      <div class="p-10px">
        <div
          class="w-250px bg-white dark:bg-#252948 h-full b-solid box-border b-1px b-gray"
          style="border-radius: 10px; overflow: auto"
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
