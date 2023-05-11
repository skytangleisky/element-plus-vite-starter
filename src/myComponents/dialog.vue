<template>
  <div v-dialogDrag class="dragDialog absolute w-300px h-200px" style="left:0px;top:20px;">
    <input @mousedown.stop class="operation_filter" placeholder="请输入ID、简码或作业点名称">
    <div class="flex flex-row justify-between mt-0.5rem mb-0.5rem">
      <el-button @mousedown.stop type="default">北京延庆</el-button>
      <el-button @mousedown.stop type="default">还原</el-button>
    </div>
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
  display: block;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: rgba(244,244,245,.6);
  background-color: #040620;
  background-clip: padding-box;
  border: 0 solid #c1ccd3;
  appearance: none;
  border-radius: 0.3rem;
  &:focus{
    color: rgba(244,244,245,.6);
    background-color: #040620;
    border-color: #4d90fe;
    outline: 0;
  }

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
.dragDialog{
  display: flex;
  flex-direction: column;
  border-radius:10px;
  padding:1rem 1.5rem;
  background: linear-gradient(172.98deg,hsla(0,0%,100%,0.08) 1.49%,hsla(0,0%,100%,0.0208) 99.64%);
  box-shadow: 0 23px 20px -20px rgb(9 10 18 / 10%), 0 0 15px rgb(9 10 18 / 6%);
}
.dark .dragDialog{
  background:rgba(0,0,0,0.24);
}
</style>