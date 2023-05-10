<template>
  <div v-dialogDrag class="dragDialog absolute w-300px h-200px bg-red dark:bg-indigo" style="left:0px;top:0px;">
    <input @mousedown.sotp.native class="operation_filter" placeholder="请输入ID、简码或作业点名称">
    <el-button type="default">北京延庆</el-button>
    <el-button type="default">还原</el-button>
    <table>
      <thead>
        <tr>
          <th>代码</th>
          <th>名称</th>
          <th>状态</th>
          <th>装备</th>
          <th>ID</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>295</td>
          <td>千家店作业点</td>
          <td>在线</td>
          <td>火箭</td>
          <td>110229042</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script lang="ts" setup>
</script>
<style lang="scss">
.operation_filter{
  box-sizing:border-box;
  border: #c4c7ce solid 2px;
  padding: 2px 0 2px 0;
  margin: 0;
  width: 100%;
  color: var(--ep-text-color-primary);
  font-size: 16px;
  // &::-webkit-input-placeholder{
  //   color:#999;
  // }
  // &:focus{
  //   border-radius:10px 0 0 0;
  //   border: #17A1FF solid 2px;
  //   transition: border 2s;
  //   border-right:none;
  //   border-bottom:none;
  //   padding-bottom:2px;
  // }
}
</style>