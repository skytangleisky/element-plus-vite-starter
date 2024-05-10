<template>
  <div v-dialogDrag class="fourCorners">
    <!-- <div class="fourBorder border1"></div>
    <div class="fourBorder border2"></div>
    <div class="fourBorder border3"></div>
    <div class="fourBorder border4"></div> -->
    <slot></slot>
  </div>
</template>
<style scoped lang="scss">
.fourCorners {
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: rgba(255, 0, 0, 0.05);
  box-shadow: 1px 1px 16px #ff0000 inset;
  span {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  &::after {
    --offset: -1px;
    --borderWidth: 2px;
    position: absolute;
    left: var(--offset);
    top: var(--offset);
    content: "";
    width: calc(100% - 2 * var(--offset));
    height: calc(100% - 2 * var(--offset));
    border-radius: 0px;
    box-sizing: border-box;
    border: var(--borderWidth) solid #f00;
    --len: 12px;
    mask: conic-gradient(at var(--len) var(--len), transparent 75%, red 75%) 0 0 /
      calc(100% - var(--len)) calc(100% - var(--len));
  }
}
.dark .fourCorners {
  background: rgba(75, 139, 247, 0.25);
  box-shadow: 1px 1px 16px #7ccef4 inset;
  &::after {
    border: var(--borderWidth) solid #7bc6e9;
  }
}
</style>
