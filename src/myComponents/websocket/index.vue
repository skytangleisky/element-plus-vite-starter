<template>
  <div class="absolute left-0 top-0 z-5">{{ num }}</div>
  <div class="absolute left-0 top-40px z-5">{{ usedJSHeapSize }}</div>
</template>
<script lang="ts" setup>
import { onMounted, onBeforeUnmount, ref } from "vue";
import { useBus } from "../bus";
const usedJSHeapSize = ref((performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2));
let bus = useBus();
const num = ref("");
class MyWebSocket extends WebSocket {
  dead: boolean = false;
}
let ws: MyWebSocket;
function connect() {
  ws = new MyWebSocket(
    `${window.location.protocol == "https:" ? "wss:" : "ws:"}//` +
      window.location.host +
      "/backend"
  );
  ws.onopen = function () {
    ws.send(JSON.stringify({ type: "login", content: Math.ceil(Math.random() * 10000) }));
  };
  ws.onmessage = function (e) {
    var msg = JSON.parse(e.data);
    bus.wsData = msg;
    num.value = msg.content;
    // switch (msg.type) {
    //     case 'handshake':
    //     case 'login':
    //     case 'logout':
    //       console.log(msg);
    //     return;
    // }
    usedJSHeapSize.value =
      (performance.memory.usedJSHeapSize / 1000 / 1000).toFixed(2) + "MB";
  };
  ws.onerror = function (err) {
    console.log(err);
  };
  ws.onclose = function () {
    num.value = "-";
    if (!ws.dead) {
      setTimeout(() => {
        connect();
      }, 5000);
    }
  };
}
onMounted(() => {
  connect();
});
onBeforeUnmount(() => {
  if (ws) {
    ws.dead = true;
    ws.close();
  }
});
</script>
<style lang="scss"></style>
