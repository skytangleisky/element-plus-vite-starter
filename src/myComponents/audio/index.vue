<template>
  <canvas ref="canvasRef" class="w-full h-full" v-resize="resize"></canvas>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
const canvasRef = ref<HTMLCanvasElement>();
let cvs: HTMLCanvasElement;
const resize = () => {
  let rect = cvs.getBoundingClientRect();
  if (rect.width == 0 || rect.height == 0) return;
  cvs.width = rect.width;
  cvs.height = rect.height;
  draw();
};
let draw: Function = () => {};
onMounted(() => {
  cvs = canvasRef.value as HTMLCanvasElement;
  const ctx = cvs.getContext("2d") as CanvasRenderingContext2D;
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2 ** 10;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      source.connect(analyser);

      draw = () => {
        // analyser.getByteTimeDomainData(dataArray);
        analyser.getByteFrequencyData(dataArray);

        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, cvs.width, cvs.height);

        ctx.lineWidth = 2;
        ctx.strokeStyle = "#fff";

        ctx.beginPath();

        const sliceWidth = (cvs.width * 1.0) / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 255.0;
          const y = (cvs.height - v * cvs.height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          x += sliceWidth;
        }
        ctx.stroke();
      };
      function loop() {
        requestAnimationFrame(loop);
        draw();
      }
      loop();
    })
    .catch((err) => {
      console.error("The following error occurred: " + err);
    });
});
</script>
