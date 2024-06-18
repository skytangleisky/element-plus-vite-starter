<template>
  <div v-dialogDrag class="planPanel z-1">
    <div class="item m-t-4px m-b-4px" v-for="k in 10" :key="k">
      <div
        class="h-full w-90px flex items-center justify-left"
        style="border: 1px solid grey; box-sizing: border-box"
      >
        <div class="flex flex-col">
          <span>13073009</span><span class="font-size-20px">狼山</span>
        </div>
      </div>
      <div class="flex flex-col w-full">
        <div class="flex">
          <div class="flex flex-col" style="border: 1px solid grey">
            <div>作业状态</div>
            <div style="font-weight: bolder; font-size: 16px">作业申请</div>
          </div>
          <div class="flex flex-col" style="border: 1px solid grey">
            <div>发送状态</div>
            <div style="font-weight: bolder; font-size: 16px">发送成功</div>
          </div>
          <div class="flex flex-col" style="border: 1px solid grey">
            <div>作业点代码</div>
            <div style="font-weight: bolder; font-size: 16px">915</div>
          </div>
          <div class="flex flex-col" style="border: 1px solid grey">
            <div>申请时间</div>
            <div style="font-weight: bolder; font-size: 16px">17:59</div>
          </div>
          <div class="flex flex-col" style="border: 1px solid grey">
            <div>申请时长</div>
            <div style="font-weight: bolder; font-size: 16px">60秒</div>
          </div>
          <div class="flex-1 flex flex-col" style="border: 1px solid grey">
            <div>上报单位</div>
            <div style="font-weight: bolder; font-size: 16px">北京气象局</div>
          </div>
        </div>
        <div class="flex h-full">
          <div
            class="flex-1 flex justify-center items-center bg-green-7"
            style="border: 1px solid grey; font-weight: bolder"
          >
            申请(17:50)
          </div>
          <div
            class="flex-1 flex justify-center items-center"
            style="border: 1px solid grey; font-weight: bolder"
          >
            批复
          </div>
          <div
            class="flex-1 flex justify-center items-center"
            style="border: 1px solid grey; font-weight: bolder"
          >
            开始
          </div>
          <div
            class="flex-1 flex justify-center items-center"
            style="border: 1px solid grey; font-weight: bolder"
          >
            结束
          </div>
          <div
            class="flex-1 flex justify-center items-center"
            style="border: 1px solid grey; font-weight: bolder"
          >
            完成
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.planPanel {
  overflow: auto;
  position: absolute;
  width: 500px;
  height: 400px;
  background-color: white;
  left: 10px;
  border-radius: 10px;
  padding: 7px;
  top: 240px;
  .item {
    border: 1px solid grey;
    height: 80px;
    display: flex;
    flex-direction: row;
  }
}
.dark .planPanel {
  background: #304156;
}
</style>
