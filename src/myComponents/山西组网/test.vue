<template>
  <div class="testContainer"></div>
</template>
<style lang="scss">

// .testContainer {
//   background: url('/texture.webp');
//   background:conic-gradient(#ff00fa, #fe3, #0f3, #ff00fa);
//   border-radius:100px;
//   padding:1px;
// }
@property --a{
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}
.testContainer{
  border-radius: 20px;
  background:#00000080;
  &::before{
    position: absolute;
    border-radius: inherit;
    width: 100%;
    height: 100%;
    content:'';
    background:repeating-conic-gradient(from var(--a),#45f3ff 0%,#45f3ff 5%,transparent 5%,transparent 40%,#45f3ff 50%);
    padding:2px;
    animation: rotating 4s linear infinite;
    mask:linear-gradient(#fff 0 100%) content-box,linear-gradient(#fff 0 100%);
    mask-composite:exclude;
    animation-delay: 0s;
    box-sizing: border-box;
  }
  &::after{
    position: absolute;
    border-radius: inherit;
    width: 100%;
    height: 100%;
    content:'';
    background:repeating-conic-gradient(from var(--a),#ff2770 0%,#ff2770 5%,transparent 5%,transparent 40%,#ff2770 50%);
    padding:2px;
    animation: rotating2 4s linear infinite;
    mask:linear-gradient(#fff 0 100%) content-box,linear-gradient(#fff 0 100%);
    mask-composite:exclude;
    animation-delay: -1s;
    box-sizing: border-box;
  }
}
@keyframes rotating {
  0%{
    --a:0deg;
  }
  100%{
    --a:360deg;
  }
}
@keyframes rotating2 {
  0%{
    --a:0deg;
  }
  100%{
    --a:360deg;
  }
}
</style>