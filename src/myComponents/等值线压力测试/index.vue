<template>
<canvas ref="canvasRef" class="contour-canvas" width="1028" height="1028"></canvas>
</template>
<script lang="ts" setup>
import * as d3 from 'd3';
import { onMounted,ref } from 'vue';
const canvasRef = ref<HTMLCanvasElement>();
let time = performance.now()
let startTime = performance.now() 
onMounted(async()=>{
  printTime('挂载时间')
  startTime = performance.now()
  const image1 = await loadTile({z:2,y:1,x:2})
  const image2 = await loadTile({z:2,y:1,x:3})
  const image3 = await loadTile({z:2,y:2,x:2})
  const image4 = await loadTile({z:2,y:2,x:3})
  const ctx = canvasRef.value!.getContext('2d') as CanvasRenderingContext2D
  ctx.drawImage(image1,0,0)
  ctx.drawImage(image2,514,0)
  ctx.drawImage(image3,0,514)
  ctx.drawImage(image4,514,514)
  console.log(performance.now()-startTime,'总耗时')
})
async function loadTile({z, y, x}:{z:number,y:number,x:number}) {
  let image = await loadMap('https://terrain.tanglei.site/?lyrs=terrain&x={x}&y={y}&z={z}'.replace('{x}',x.toString()).replace('{y}',y.toString()).replace('{z}',z.toString())).catch(e=>{
    throw e
  }) as HTMLImageElement;
  printTime('加载数据时间')
  const cvs = document.createElement('canvas');
  cvs.width = cvs.height = 514;
  const ctx = cvs.getContext('2d', {willReadFrequently: true}) as CanvasRenderingContext2D;
  ctx.drawImage(image, 0, 0, cvs.width, cvs.height);
  const imageData = ctx.getImageData(0, 0, cvs.width, cvs.height);
  const grayData = [];
  for (let i = 0; i < imageData.data.length; i += 4) {
    const r = imageData.data[i];
    const g = imageData.data[i + 1];
    const b = imageData.data[i + 2];
    let h = (r*255*255+g*255+b)*0.1-10000//rgb->高度(米)
    grayData.push(h); // 标准化到 [0, 1]
  }
  printTime('准备数据时间')

  const dom = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  const contours = d3.contours().size([cvs.width, cvs.height]).thresholds(d3.range(0, 8000, 80));
  const data = contours(grayData);
  printTime('提取等值线时间')
  const svg = d3.select(dom)
    .attr("opacity",1)
    .attr("viewBox", `0 0 ${cvs.width} ${cvs.height}`)
    .attr("width", 514)
    .attr("height", 514);
  const color = d3.scaleSequential(d3.interpolateViridis).domain([0, 8000]);
  svg.selectAll("path")
    .data(data)
    .join("path")
    .attr("d", d3.geoPath()) // 使用 d3.geoPath() 渲染等高线路径
    // .attr("fill", d => color(d.value)) // 填充颜色
    .attr('fill','none')
    .attr("stroke", d => color(d.value))
    .attr("stroke-width", 1)
  printTime('绘制svg时间')

  const img = await svg2Image(dom).catch(e=>{
    throw e
  }) as HTMLImageElement;
  printTime('svg->image时间')
  ctx.clearRect(0, 0, cvs.width, cvs.height);
  ctx.drawImage(img, 0, 0, cvs.width, cvs.height);
  // ctx.strokeStyle = 'red';
  // ctx.strokeRect(0, 0, cvs.width, cvs.height);
  ctx.font = '24px sans-serif';
  ctx.fillStyle = 'black';
  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';
  ctx.fillText(`${x}/${y}/${z}`, 0, 0);
  printTime('绘制文字时间')
  return cvs;
}
function loadMap(url:string){
  return new Promise((resolve,reject)=>{
    let image = new Image()
    image.onload = () => {
      resolve(image)
    }
    image.onabort = image.onerror = reject
    image.crossOrigin = 'Anonymous';
    image.src = url
  })
}
function svg2Image(svg:SVGElement){
  return new Promise((resolve,reject)=>{
    let image = new Image()
    image.onload = () => {
      URL.revokeObjectURL(url)
      resolve(image)
    }
    image.onabort = image.onerror = (error)=>{
      URL.revokeObjectURL(url)
      reject(error)
    }
    image.crossOrigin = 'Anonymous';
    let url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml' }));
    image.src = url
  })
}
function printTime(label:string){
  console.log(label,(performance.now()-time).toFixed(2),'ms')
  time = performance.now()
}
navigator.geolocation.getCurrentPosition(
  (position) => {
    console.log(position)
  },
  (error) => {
    console.log(error)
  }
)
</script>
<style lang="scss">
.contour-canvas{
  background:white;
  position: absolute;
  left: 0;
  top: 0;
}
</style>