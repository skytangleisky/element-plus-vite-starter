<template>
  <div class="absolute bottom-0 z-5 right-0">
    <div>{{ infos.num }}</div>
    <div>{{ infos.delay }}</div>
    <div>{{ infos.usedJSHeapSize }}</div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, onBeforeUnmount, reactive } from "vue";
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
    switch (obj.type) {
      case "heart2": //客户端延时
        obj.clientTime2 = performance.now();
        infos.delay = (obj.clientTime2 - obj.clientTime1).toFixed(2) + "ms";
        infos.usedJSHeapSize =
          (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2) + "MB";
        break;
      case "heart4": //服务端延时
        // obj.type = "heart3";
        // ws.readyState === WebSocket.OPEN && ws.send(JSON.stringify(obj));
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
      case "808定位数据":
        bus.uavData = obj;
        break;
      case "rhi":
        bus.wsData = obj;
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
  window.addEventListener("beforeunload", dispose);
});
function dispose() {
  sleeper.abort();
  if (ws) {
    ws.dead = true;
    ws.close();
  }
}
onBeforeUnmount(() => {
  infos.num = "";
  infos.delay = "";
  infos.usedJSHeapSize = "";
  dispose();
});
</script>
