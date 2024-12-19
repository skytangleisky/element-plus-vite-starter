<template>
<canvas ref="canvasRef" class="contour-canvas" width="1028" height="1028"></canvas>
</template>
<script lang="ts" setup>
import * as d3 from 'd3';
import {contours} from '../../../packages/d3-contour/src/index.js'
import { onMounted,ref } from 'vue';
const size = 15
const canvasRef = ref<HTMLCanvasElement>();
let time = performance.now()
let startTime = performance.now() 
let arr = new Array<any>();
for(let i=0;i<size*size;i++){
  arr.push(Number(Math.random().toFixed(1)))
}
onMounted(async()=>{
  printTime('挂载时间')
  startTime = performance.now()
  const ctx = canvasRef.value!.getContext('2d') as CanvasRenderingContext2D
  // const image1 = await loadTile({z:2,y:1,x:2})
  // const image2 = await loadTile({z:2,y:1,x:3})
  // const image3 = await loadTile({z:2,y:2,x:2})
  // const image4 = await loadTile({z:2,y:2,x:3})
  // ctx.drawImage(image1,0,0)
  // ctx.drawImage(image2,514,0)
  // ctx.drawImage(image3,0,514)
  // ctx.drawImage(image4,514,514)
  ctx.translate(217,217)
  const image = await loadTileTest({z:2,y:1,x:2})
  ctx.drawImage(image,0,0)
  let part = 514/10
  ctx.setLineDash([part*0.7,part*0.1,part*0.1,part*0.1])
  ctx.strokeStyle ='#00000020';
  ctx.strokeRect(0,0,514,514)
  for(let j=0;j<size;j++){
    for(let i=0;i<size;i++){
      let pos:[number,number] = [(i+0.5)*514/size,(j+0.5)*514/size]
      ctx.beginPath()
      ctx.arc(...pos,2,0,2*Math.PI)
      ctx.fillStyle = 'rgba(0,0,0,0.5)'
      ctx.setLineDash([])
      ctx.strokeStyle ='#000000';
      ctx.stroke()
      ctx.fillStyle = 'red'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      // ctx.fillText(arr[j*size+i],...pos)
    }
  }
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
    grayData.push(h/5000); // 标准化到 [0, 1]
  }
  printTime('准备数据时间')

  const dom = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  const c = contours()
  c.size([cvs.width, cvs.height])
  c.thresholds(d3.range(0, 1, 0.1))
  const data = c(grayData);
  // const c = contours()
  // c.size([size,size])
  // c.thresholds(d3.range(0, 1.1, 0.1))
  // const data = c(arr);
  console.log(data)
  printTime('提取等值线时间')
  const lineWidth = 1
  const svg = d3.select(dom)
    .attr("opacity",1)
    .attr("viewBox", `${lineWidth/2} ${lineWidth/2} ${cvs.width-lineWidth} ${cvs.height-lineWidth}`)
    .attr("width", 514)
    .attr("height", 514);
  const color = d3.scaleSequential(d3.interpolateTurbo).domain([0, 1]);
  svg.selectAll("path")
    .data(data)
    .join("path")
    .attr('stroke-linejoin','round')
    .attr('stroke-linecap','round')
    .attr("d", d3.geoPath().projection({
      stream: function (s) {
        return {
          point: function (x, y) {
            // s.point(514/size*x, 514/size*y); // 映射坐标
            s.point(x, y); // 映射坐标
          },
          lineStart: s.lineStart.bind(s),
          lineEnd: s.lineEnd.bind(s),
          polygonStart: s.polygonStart.bind(s),
          polygonEnd: s.polygonEnd.bind(s),
        };
      }
    }) as d3.GeoPath<any, GeoGeometryObjects>) // 使用 d3.geoPath() 渲染等高线路径
    // .attr("fill", d => color(d.value)) // 填充颜色
    .attr('fill','none')
    .attr("stroke", d => color(d.value))
    .attr("stroke-width", lineWidth)
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
async function loadTileTest({z, y, x}:{z:number,y:number,x:number}) {
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
    grayData.push(h/5000); // 标准化到 [0, 1]
  }
  printTime('准备数据时间')

  const dom = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  // const tmp = d3.contours().size([cvs.width, cvs.height]).thresholds(d3.range(0, 8000, 80));
  // const c = contours()
  // c.size([cvs.width, cvs.height])
  // c.thresholds(d3.range(0, 1, 0.1))
  // const data = c(grayData);
  const c = contours()
  c.size([size,size])
  c.thresholds(d3.range(0, 1.1, 0.1))
  const data = c(arr);
  console.log(data)
  printTime('提取等值线时间')
  const lineWidth = 1
  const svg = d3.select(dom)
    .attr("opacity",1)
    .attr("viewBox", `${lineWidth/2} ${lineWidth/2} ${cvs.width-lineWidth} ${cvs.height-lineWidth}`)
    .attr("width", 514)
    .attr("height", 514);
  const color = d3.scaleSequential(d3.interpolateTurbo).domain([0, 1]);
  svg.selectAll("path")
    .data(data)
    .join("path")
    .attr('stroke-linejoin','round')
    .attr('stroke-linecap','round')
    .attr("d", d3.geoPath().projection({
      stream: function (s) {
        return {
          point: function (x, y) {
            s.point(514/size*x, 514/size*y); // 映射坐标
            // s.point(x, y); // 映射坐标
          },
          lineStart: s.lineStart.bind(s),
          lineEnd: s.lineEnd.bind(s),
          polygonStart: s.polygonStart.bind(s),
          polygonEnd: s.polygonEnd.bind(s),
        };
      }
    }) as d3.GeoPath<any, GeoGeometryObjects>) // 使用 d3.geoPath() 渲染等高线路径
    // .attr("fill", d => color(d.value)) // 填充颜色
    .attr('fill','none')
    .attr("stroke", d => color(d.value))
    .attr("stroke-width", lineWidth)
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