<template>
  <div
    ref="termRef"
    style="
      position: absolute;
      width: 100%;
      height: 100%;
      overflow: auto;
      background-color: black;
    "
  ></div>
</template>
<script setup>
import { onMounted, ref, onBeforeUnmount } from "vue";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
let termRef = ref(null);
onMounted(() => {
  let term = new Terminal();
  let fitAddon = new FitAddon();
  term.loadAddon(fitAddon);
  term.open(termRef.value);
  // term.write("Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ");
  let resizeObserver = new ResizeObserver(() => {
    fitAddon.fit();
  });
  resizeObserver.observe(termRef.value);
  onBeforeUnmount(() => {
    term.dispose();
    if (ws) {
      ws.dead = true;
      ws.close();
    }
    resizeObserver.disconnect();
  });
  let ws;
  term.onData((data) => ws && ws.send(JSON.stringify({ input: data })));
  term.onResize((size) => {
    ws &&
      ws.readyState == 1 &&
      ws.send(JSON.stringify({ resize: { cols: size.cols, rows: size.rows } }));
  });
  connect();
  function connect() {
    // ws = new WebSocket('ws://websocket.tanglei.top')
    ws = new WebSocket(`ws://127.0.0.1:1234`);
    ws.onopen = function () {
      console.log("connected");
      // ws.send(
      //   JSON.stringify({ type: "login", content: Math.ceil(Math.random() * 10000) })
      // );
      ws.send(JSON.stringify({ resize: { cols: term.cols, rows: term.rows } }));
    };
    ws.onmessage = function (event) {
      let output = JSON.parse(event.data);
      console.log(event.data);
      term.write(output.output);
    };
    ws.onerror = function () {};
    ws.onclose = function () {
      console.log("disconnected");
      if (!ws.dead) {
        setTimeout(() => {
          console.log("reconnecting");
          connect();
        }, 5000);
      }
    };
  }
});
</script>
