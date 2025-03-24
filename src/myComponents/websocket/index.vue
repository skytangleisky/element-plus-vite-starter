<template>
</template>
<script lang="ts" setup>
import { onMounted, onBeforeUnmount } from "vue";
import { useBus } from "../bus";
import { eventbus } from "~/eventbus";
import Sleeper from "../zrender/sleeper";
import { useSettingStore } from "../../stores/setting";
let countdown = 0
const setting = useSettingStore();
let sleeper = new Sleeper();
let bus = useBus();
class MyWebSocket extends WebSocket {
  dead: boolean = false;
}
let ws: MyWebSocket;
function connect() {
  ws = new MyWebSocket(
    `${window.location.protocol == "https:" ? "wss:" : "ws:"}//` + window.location.host + "/backend"
  );
  ws.onopen = function () {
    setting.网络状态 = "已连接"
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
    loop();//心跳检测
  };
  ws.onmessage = function (e) {
    var obj = JSON.parse(e.data);
    switch (obj.type) {
      case "heart2": //客户端延时
        obj.clientTime2 = performance.now();
        setting.网络状态 = (obj.clientTime2 - obj.clientTime1).toFixed(2) + "ms";
        setting.内存占用 =
          (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2) + "MB";
        break;
      case "heart4": //服务端延时
        // obj.type = "heart3";
        // ws.readyState === WebSocket.OPEN && ws.send(JSON.stringify(obj));
        break;
      case "handshake":
        setting.在线人数 = obj.content;
        break;
      case "login":
        break;
      case "logout":
        setting.在线人数 = obj.content;
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
      case "808终端离线":
        bus.uavOffline = obj;
        break;
      case "rhi":
        bus.wsData = obj;
        break;
      case "人影航迹数据":
        eventbus.emit('人影-飞机位置',obj.data.aircrafts)
        break;
      default:
        console.log(obj)
    }
    // infos.usedJSHeapSize = (performance.memory.usedJSHeapSize / 1000 / 1000).toFixed(2) + "MB";
  };
  ws.onerror = (err)=>{
    // console.log(err)
  }
  ws.onclose = function () {
    countdown = 5;
    sleeper.abort();
    setting.在线人数 = "-";
    if (!ws.dead) {
      reconnect()
    }
  };
}
let timer:any = 0
let reconnect = ()=>{
  timer = setTimeout(() => {
    if(countdown<1){
      sleeper = new Sleeper();
      setting.网络状态 = "重连中..."
      connect();
    }else{
      setting.网络状态 = `${countdown}秒后重连`
      countdown -= 1;
      reconnect()
    }

  }, 1000);
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
  clearTimeout(timer)
  sleeper.abort();
  if (ws) {
    ws.dead = true;
    ws.close();
  }
}
onBeforeUnmount(() => {
  clearInterval(timer)
  setting.在线人数 = "";
  setting.网络状态 = "";
  setting.内存占用 = "";
  dispose();
});
</script>
