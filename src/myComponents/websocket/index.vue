<template>
  <div class="infos absolute left-0 top-0 z-5">
    <div>{{ infos.num }}</div>
    <div>{{ infos.delay }}</div>
    <div>{{ infos.usedJSHeapSize }}</div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, onBeforeUnmount, ref, reactive } from "vue";
import { useBus } from "../bus";
import Sleeper from "../zrender/sleeper";
let sleeper = new Sleeper();
let bus = useBus();
const infos = reactive({
  num: "",
  delay: "",
  usedJSHeapSize: "",
});
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
    const loop = async () => {
      //心跳检测
      try {
        ws.readyState === WebSocket.OPEN &&
          ws.send(
            JSON.stringify({
              content: null,
              type: "heart1",
              user_list: [],
              clientTime1: performance.now(),
            })
          );
        await sleeper.sleep(5000);
        loop();
      } catch (e) {
        console.log(e);
        //不做处理
      }
    };
    loop();
  };
  ws.onmessage = function (e) {
    var obj = JSON.parse(e.data);
    bus.wsData = obj;
    switch (obj.type) {
      case "heart2": //客户端延时
        obj.type = "heart3";
        obj.clientTime2 = performance.now();
        // console.log((obj.clientTime2 - obj.clientTime1).toFixed(2), "ms");
        ws.readyState === WebSocket.OPEN && ws.send(JSON.stringify(obj));
        break;
      case "heart4": //服务端延时
        let cDelay = (obj.clientTime2 - obj.clientTime1).toFixed(2);
        let sDelay = (obj.serverTime2 - obj.serverTime1).toFixed(2);
        infos.delay = sDelay + "ms";
        infos.usedJSHeapSize =
          (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2) + "MB";
        break;
      case "handshake":
        infos.num = obj.content;
        break;
      case "login":
        break;
      case "logout":
        infos.num = obj.content;
        console.log(obj);
        break;
      case "目录信息":
        console.log(obj.dirs, obj.files);
        break;
      case "目录信息改变":
        console.log(obj.event, obj.file);
        break;
    }
    infos.usedJSHeapSize =
      (performance.memory.usedJSHeapSize / 1000 / 1000).toFixed(2) + "MB";
  };
  ws.onerror = function (err) {
    console.log(err);
  };
  ws.onclose = function () {
    sleeper.abort();
    infos.num = "-";
    if (!ws.dead) {
      setTimeout(() => {
        sleeper = new Sleeper();
        connect();
      }, 5000);
    }
  };
}
onMounted(() => {
  connect();
});
onBeforeUnmount(() => {
  sleeper.abort();
  if (ws) {
    ws.dead = true;
    ws.close();
  }
});
</script>
<style lang="scss">
.infos {
  div {
    min-height: 1em;
    line-height: 1em;
  }
}
</style>
