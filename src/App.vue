<template>
  <el-config-provider namespace="ep">
    <!-- <BaseHeader />
    <div style="display: flex">
      <BaseSide />
      <div>
        <img alt="Vue logo" class="element-plus-logo" src="./assets/logo.png" />
        <HelloWorld msg="Hello Vue 3.0 + Element Plus + Vite" />
      </div>
    </div> -->
    <div class="app-container">
      <BaseHeader />
      <div class="nav-wrapper"></div>
      <div class="four-container">
        <div class="fourBorder border1"></div>
        <div class="fourBorder border2"></div>
        <div class="fourBorder border3"></div>
        <div class="fourBorder border4"></div>
      </div>
      <test-button></test-button>
      <test-border></test-border>
    </div>
  </el-config-provider>
</template>
<script>
import TestButton from './elementplus/basic/button.vue'
import TestBorder from './elementplus/basic/border.vue'
export default {
  components:{
    TestButton,
    TestBorder,
  }
}
</script>

<style lang="scss">
#app {
  text-align: center;
  color: var(--ep-text-color-primary);
}
.app-container{
  overflow:auto;
  width: 100vw;
  height: 100vh;
  background: url(assets/newBg.jpg);
  background-size: cover;
}
.nav-wrapper{
  width: 100%;
  line-height: 50px;
  height: 65px;
  background: url(assets/nav.png) no-repeat;
  background-size:100% 100%;
}
.element-plus-logo {
  width: 50%;
}



.four-container {
  width: 200px;
  height: 200px;
  position: relative;
  box-sizing: border-box;
  background: rgba(75, 139, 247, 0.05);
  box-shadow: 1px 1px 16px #7ccef4 inset;
  .fourBorder {
    position: absolute;
    width: 10px;
    height: 10px;
    &.border1 {
      left: -1px;
      top: -1px;
      border-left: 2px solid #7bc6e9;
      border-top: 2px solid #7bc6e9;
    }
    &.border2 {
      right: -1px;
      top: -1px;
      border-right: 2px solid #7bc6e9;
      border-top: 2px solid #7bc6e9;
    }
    &.border3 {
      left: -1px;
      bottom: -1px;
      border-left: 2px solid #7bc6e9;
      border-bottom: 2px solid #7bc6e9;
    }
    &.border4 {
      right: -1px;
      bottom: -1px;
      border-right: 2px solid #7bc6e9;
      border-bottom: 2px solid #7bc6e9;
    }
  }
}
</style>
