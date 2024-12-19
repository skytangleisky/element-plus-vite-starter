import * as d3 from 'd3'
export default class CustomRasterSource {
  constructor() {
      // Setting type to `custom` is required to use CustomSource API
      this.type = 'custom';
      this.cache = new Map();
      this.tileSize = 514;
      this.url='https://terrain.tanglei.site/?lyrs=terrain&x={x}&y={y}&z={z}'
  }

  async loadTile({z, x, y}) {
    const key = `${z}/${x}/${y}`;
    const tile = this.cache.get(key);
    if (tile) return tile;
    let image = await loadMap(this.url.replace('{x}',x).replace('{y}',y).replace('{z}',z)).catch(e=>{
      throw e
    })
    const cvs = document.createElement('canvas');
    cvs.width = cvs.height = 514;
    const ctx = cvs.getContext('2d', {willReadFrequently: true});
    ctx.drawImage(image, 0, 0, cvs.width, cvs.height);
    const imageData = ctx.getImageData(0, 0, cvs.width, cvs.height);
    const grayData = [];
    for (let i = 0; i < imageData.data.length; i += 4) {
      const r = imageData.data[i];
      const g = imageData.data[i + 1];
      const b = imageData.data[i + 2];
      let h = (r*255*255+g*255+b)*0.1-10000//rgb->高度(米)
      grayData.push(h);
    }


    const dom = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    let time = performance.now();
    let delta;
    if(z>=14){
      delta = 50
    }else if(z>=12){
      delta = 100
    }else if(z>=10){
      delta = 200
    }else if(z>=8){
      delta = 400
    }else{
      delta = 800
    }
    console.log(delta)
    const contours = d3.contours().size([cvs.width, cvs.height]).thresholds(d3.range(0, 5000, delta));
    const data = contours(grayData)
    console.log('等值线提取时间',performance.now()-time,'ms')
    const lineWidth = 1
    const svg = d3.select(dom)
      .attr("opacity",0.5)
      .attr("viewBox", `${lineWidth/2} ${lineWidth/2} ${cvs.width-lineWidth} ${cvs.height-lineWidth}`)
      .attr("width", 514)
      .attr("height", 514);
    const color = d3.scaleSequential(d3.interpolateTurbo).domain([0, 5000]);
    svg.selectAll("path")
      .data(data)
      .join("path")
      .attr('stroke-linejoin','round')
      .attr('stroke-linecap','round')
      .attr("d", d3.geoPath()) // 使用 d3.geoPath() 渲染等高线路径
      .attr("fill", d => color(d.value)) // 填充颜色
      // .attr('fill','none')
      // .attr("stroke", d => color(d.value))
      .attr("stroke", '#000')
      .attr("stroke-width", lineWidth)

    const img = await svg2Image(dom).catch(e=>{
      throw e
    })
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    ctx.drawImage(img, 0, 0, cvs.width, cvs.height);
    // ctx.strokeStyle = 'red';
    // ctx.strokeRect(0, 0, cvs.width, cvs.height);
    ctx.font = '24px sans-serif';
    ctx.fillStyle = 'white';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.fillText(`${x}/${y}/${z}`, 0, 0);
    this.cache.set(key, cvs);
    return cvs;
  }
}

function loadMap(url){
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
function svg2Image(svg){
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
