<template>
</template>
<script lang="ts" setup>
import { onMounted, onBeforeUnmount, reactive } from "vue";
import { useBus } from "../bus";
import { eventbus } from "~/eventbus";
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
    `${window.location.protocol == "https:" ? "wss:" : "ws:"}//` + window.location.host + "/aircraft_position/ws/trackdata"
  );
  ws.onopen = function () {
    ws.send(JSON.stringify({ type: "login", content: Date.now()}));
    const loop = async () => {
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
    // loop();//心跳检测
  };
  ws.onmessage = function (e) {
    var obj = JSON.parse(e.data);
    if(Array.isArray(obj)){
      eventbus.emit('人影-飞机位置',obj)
    }
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
      }, 4000);
    }
  };
}
function process(){
  ws.send(
    JSON.stringify({
      content: '',
      type: "获取nps数据",
      user_list: [],
      clientTime1: performance.now(),
    })
  );
}
onMounted(() => {
  eventbus.on('获取nps数据',process)
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
