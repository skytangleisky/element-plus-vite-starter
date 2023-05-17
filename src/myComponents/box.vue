<template>
  <div v-dialogDrag class="four-container">
    <div class="fourBorder border1"></div>
    <div class="fourBorder border2"></div>
    <div class="fourBorder border3"></div>
    <div class="fourBorder border4"></div>
    <slot></slot>
  </div>
</template>
<script>
export default{

}
</script>
<style lang='scss'>
.four-container {
  width: 200px;
  height: 200px;
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: rgba(255, 0, 0, 0.05);
  box-shadow: 1px 1px 16px #ff0000 inset;
  .fourBorder {
    position: absolute;
    width: 10px;
    height: 10px;
    &.border1 {
      left: -1px;
      top: -1px;
      border-left: 2px solid #ff0000;
      border-top: 2px solid #ff0000;
    }
    &.border2 {
      right: -1px;
      top: -1px;
      border-right: 2px solid #ff0000;
      border-top: 2px solid #ff0000;
    }
    &.border3 {
      left: -1px;
      bottom: -1px;
      border-left: 2px solid #ff0000;
      border-bottom: 2px solid #ff0000;
    }
    &.border4 {
      right: -1px;
      bottom: -1px;
      border-right: 2px solid #ff0000;
      border-bottom: 2px solid #ff0000;
    }
  }
}
.dark{
  .four-container {
    background: rgba(75, 139, 247, 0.05);
    box-shadow: 1px 1px 16px #7ccef4 inset;
    .fourBorder {
      position: absolute;
      width: 10px;
      height: 10px;
      &.border1 {
        border-left: 2px solid #7bc6e9;
        border-top: 2px solid #7bc6e9;
      }
      &.border2 {
        border-right: 2px solid #7bc6e9;
        border-top: 2px solid #7bc6e9;
      }
      &.border3 {
        border-left: 2px solid #7bc6e9;
        border-bottom: 2px solid #7bc6e9;
      }
      &.border4 {
        border-right: 2px solid #7bc6e9;
        border-bottom: 2px solid #7bc6e9;
      }
    }
  }
}
</style>
