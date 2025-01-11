<template>
  <div class="layout-top">
      <div class="left"></div>
      <div class="center">重庆激光测风雷达组网系统</div>
      <div class="right">{{ time }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import moment from "moment";
let time = ref();
let timerId = null;
onMounted(() => {
  // 设置时间
  timerId = setInterval(() => {
      time.value = moment().format("YYYY-MM-DD HH:mm:ss");
  }, 1000);
});
onBeforeUnmount(() => {
  clearInterval(timerId);
});
</script>

<style lang="scss" scoped>

.layout-top{
  color: #29fcff;
  height:80px;
  width: 100%;
  background-color: #0f1751;
  background-image: url(~/assets/layout-top-bg.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  display: flex;
  position: absolute;
  top: 0;
  left:0 ;
  z-index: 99;
  .left{
    flex: 1;
  }
  .center {
      flex: 3;
      font-size: 36px;
      font-weight: 600;
      text-align: center;
      line-height: 80px;
      // box-shadow: 0px 0px 10px 0px #105ED9;
  }
  .right{
      flex: 1;
      text-align: right;
      line-height: 90px;
      font-size: 18px;
      font-weight: 600;
      padding-right: 20px;
  }
}
</style>
