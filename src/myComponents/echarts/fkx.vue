<template>
  <div ref="fkxContainer" class="fkxContainer"></div>
</template>
<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import DBS, { Fdata } from "~/tools/fkx.js";
const fkxContainer = ref(null);
onMounted(() => {
  const dbs = new DBS();
  dbs.init({
    el: fkxContainer.value,
    size: 1,
  });
  Fdata.timestamp = new Date(Math.floor(new Date().getTime() / 5000) * 5000).Format();
  dbs.process(Fdata);
  const timer = setInterval(() => {
    Fdata.timestamp = new Date(Math.floor(new Date().getTime() / 5000) * 5000).Format();
    dbs.process(Fdata);
    // window.clearInterval(timer);
  }, 5000);
  onBeforeUnmount(() => {
    clearInterval(timer);
  });
});
</script>
<style lang="scss">
.fkxContainer {
  scroll-snap-align: start;
  scroll-snap-stop: always;
  width: 100%;
  min-height: 400px;
}
</style>
