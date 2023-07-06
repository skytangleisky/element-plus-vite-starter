<template>
  <div class="login_dialog">
    <div class="leftImage"></div>
    <div class="rightPlane"></div>
  </div>
</template>
<script lang="ts" startup>
</script>
<style lang="scss">
.login_dialog{
  position: absolute;
  transform: translate(-50%,-50%);
  box-shadow: 4px 4px 12px 4px rgba(23,38,42,.49);
  top:50%;
  left:50%;
  width:1200px;
  height:600px;
  background-color: #f00;
  display: flex;
  flex-direction: row;
  .leftImage{
    width:800px;
    height:600px;
    background-image: url(assets/9.jpg);
    background-size: cover;
  }
}
</style>