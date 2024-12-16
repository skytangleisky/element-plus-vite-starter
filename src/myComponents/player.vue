<template>
  <video
    ref="video" 
    class="video-element" 
    controls>
  </video>
  <div class="play-list">
    <ul>
      <li v-for="(item, index) in videoList.list" :key="index" @click="evt=>click(evt,item)">
        <img :src="item.logo" style="width:128px;height: 64px;">
        {{ item.channel }}
      </li>
    </ul>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted,reactive,onBeforeUnmount } from 'vue';
import Hls from 'hls.js'
// const videoSrc = 'https://0472.org/hls/cgtn.m3u8';
const videoSrc = '/video1/nmtv/2354general.m3u8?txSecret=cf5f71d0000862b18f5813607b3dfd5b&txTime=771E8800';
// const poster = 'https://path-to-your-video-poster.jpg';

const video = ref<HTMLVideoElement | null>(null); // 引用 video DOM 元素
let hls: Hls | null = null;

import text from './ipv6.m3u?raw'
interface VideoItem {
  flag:string;
  name:string;
  logo:string;
  title:string;
  channel:string;
  src:string;
}
const videoList = reactive({
  list:new Array<VideoItem>()
})
const lines = text.split(/\r\n|\r|\n/g);
for (let i = 0; i < lines.length; i++) {
  if (lines[i].startsWith('#EXTINF')) {
    let firstLine = lines[i+0]
    let src = lines[i+1]
    let channel = firstLine.split(',')[1]
    let [flag,name,logo,title] = firstLine.split(',')[0].split(/\s+/g)
    console.log(title)
    videoList.list.push({
      flag,
      name:name.split('=')[1].replaceAll(/"/g,''),
      logo:logo.split('=')[1].replaceAll(/"/g,''),
      title:title.split('=')[1].replaceAll(/"/g,''),
      channel,
      src
    })
  }
}
function click(evt:MouseEvent,item:VideoItem){
  let els = evt.currentTarget!.parentElement!.querySelectorAll('.active')
  els.forEach(el => {
    el.classList.remove('active')
  });
  evt.currentTarget!.classList.add('active')
  if (hls&&video.value) {
    hls.loadSource(item.src);
    video.value.play()
  }
}
onMounted(() => {
  if (Hls.isSupported() && video.value) {
    hls = new Hls({
      debug:false,
    });
    hls.loadSource(videoSrc);
    hls.attachMedia(video.value);
    // hls.on(Hls.Events.MEDIA_ATTACHED, () => {
    //   console.log('HLS.js is ready to play');
    // });

    hls.on(Hls.Events.ERROR, (event, data) => {
      console.error('HLS.js error:', data);
    });
  } else if (video.value?.canPlayType('application/vnd.apple.mpegurl')) {
    // 处理 Safari 的原生 HLS 支持
    video.value.src = videoSrc;
    // video.value.addEventListener('loadedmetadata', () => {
    //   video.value?.play();
    // });
  }
});
// crossorigin="Anonymous"
onBeforeUnmount(() => {
  if (hls) {
    hls.destroy();
    hls = null;
  }
});
</script>

<style lang="scss">
.video-element {
  width: 100%;
  height: -webkit-fill-available;
  border-radius: 8px;
  position: absolute;
}

.play-list {
  list-style: none;
  padding: 0;
  margin: 0;
  position: absolute;
  left: 0;
  top:0;
  height: -webkit-fill-available;
  overflow: auto;
  ul,li{
    margin: 0;
    padding: 0;
    list-style: none;
  }
  li{
    background: #00000080;
    border:4px solid black;
    box-sizing: border-box;
  }
  li.active{
    box-sizing: border-box;
    border:4px solid #0f0;
  }
}
</style>
