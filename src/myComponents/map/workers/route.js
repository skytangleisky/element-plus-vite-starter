import { wgs84togcj02 } from "./mapUtil"
let loadStatus = 'unload'
let queue = []
let 航线
let MinLng=+180;
let MaxLng=-180;
let MinLat=+90;
let MaxLat=-90;
let maxLineWidth=0;
let isDrawed = false;
let MAXLINEWIDTH;
function draw(args){
  MAXLINEWIDTH=maxLineWidth*TileWidth*Math.pow(2,args._LL)/40075016.6855784861531768177614;
  args.cvs = new OffscreenCanvas(TileWidth,TileWidth);
  var ctx = args.cvs.getContext("2d",{antialias:false});
  // ctx.rect(0,0,20,10);
  // ctx.moveTo(x,0);
  // ctx.strokeStyle="#ff000088";
  // ctx.fillStyle="#00ff0088";
  // ctx.fill();
  // ctx.stroke();
  args.ctx = ctx;
  args._i=args.i%2**args._LL>=0?args.i%2**args._LL:args.i%2**args._LL+2**args._LL;
  args._j=args.j%2**args._LL>=0?args.j%2**args._LL:args.j%2**args._LL+2**args._LL;
  if(loadStatus=='loaded'){
    test(args)
  }else if(loadStatus=='loading'){
    queue.push(args)
  }else if(loadStatus=='unload'){
    loadStatus = 'loading'
    var xhr = new XMLHttpRequest()
    xhr.open('GET','/data/航路.json',true)
    xhr.responseType = 'json'
    xhr.send()
    xhr.onreadystatechange = function() {
      let res = 'response' in xhr ? xhr.response : xhr.responseText
      if(xhr.readyState === 4 && xhr.status === 200) {

        航线 = res
        loadStatus = 'loaded'
        for(let i=0;i<航线.length;i++){
          航线[i].color = '#'+Math.random().toString(16).substr(2, 6).toUpperCase()+'88';
          // 航线[i].color = '#00ffff88';
        }
        for(let i=0;i<航线.length;i++){
          let line = 航线[i].points.split(" ");if(line.length<2)continue;
          let widths = 航线[i].widths.split(" ");if(widths.length<2)continue;
          let heights = 航线[i].safeheis.split(" ");if(heights.length<2)continue;
          let minLng=+180;
          let maxLng=-180;
          let minLat=+90;
          let maxLat=-90;
          line = line.map(function (v) {
            let lng = v.substring(0,v.indexOf('E'));
            let lat = v.substring(v.indexOf('E')+1,v.indexOf('N'));
            let pt = {lng:Number(lng.substring(0,3))+Number(lng.substring(3,5))/60+Number(lng.substring(5,9))/100/3600,lat:Number(lat.substring(0,2))+Number(lat.substring(2,4))/60+Number(lat.substring(4,8))/100/3600}
            let tmp = wgs84togcj02(Number(lng.substring(0,3))+Number(lng.substring(3,5))/60+Number(lng.substring(5,9))/100/3600,Number(lat.substring(0,2))+Number(lat.substring(2,4))/60+Number(lat.substring(4,8))/100/3600);
            pt = {lng:tmp[0],lat:tmp[1]};
            minLng=pt.lng<minLng?pt.lng:minLng;
            maxLng=pt.lng>maxLng?pt.lng:maxLng;
            minLat=pt.lat<minLat?pt.lat:minLat;
            maxLat=pt.lat>maxLat?pt.lat:maxLat;
            return pt;
          })
          航线[i].points = line;
          航线[i].widths = widths;
          航线[i].heights = heights;
          航线[i].minLng=minLng;
          航线[i].maxLng=maxLng;
          航线[i].minLat=minLat;
          航线[i].maxLat=maxLat;
          MinLng=minLng<MinLng?minLng:MinLng;
          MaxLng=maxLng>MaxLng?maxLng:MaxLng;
          MinLat=minLat<MinLat?minLat:MinLat;
          MaxLat=maxLat>MaxLat?maxLat:MaxLat;
          widths.map(v=>{
            maxLineWidth = Number(v)>maxLineWidth ? Number(v) : maxLineWidth;
          })
        }
        test(args)
        for(let i=0;i<queue.length;i++){
          let args = queue.splice(i--,1)[0]
          test(args)
        }
      }
    }
  }
  // self.close();
}
let imgX,imgY;
let imgScale;
let TileWidth;

self.onmessage =function(evt){
  imgX = evt.data.imgX;
  imgY = evt.data.imgY;
  imgScale = evt.data.imgScale;
  TileWidth = evt.data.TileWidth;
  draw(evt.data.args);
}

function test(args){
  isDrawed = false;
  let X1 = (lng2Pixel(MinLng) - imgX)/imgScale*Math.pow(2,args._LL) - args._i*TileWidth;
  let X2 = (lng2Pixel(MaxLng) - imgX)/imgScale*Math.pow(2,args._LL) - args._i*TileWidth;
  let Y1 = (lat2Pixel(MinLat) - imgY)/imgScale*Math.pow(2,args._LL) - args._j*TileWidth;
  let Y2 = (lat2Pixel(MaxLat) - imgY)/imgScale*Math.pow(2,args._LL) - args._j*TileWidth;
  // args.ctx.save()
  // args.ctx.lineWidth=.5;
  // args.ctx.strokeStyle='#aaaaff';
  // args.ctx.lineCap = "round";
  // args.ctx.lineJoin = "round";
  // args.ctx.strokeRect(X1,Y1,X2-X1,Y2-Y1)//范围测试
  // args.ctx.restore()
  if(X1>TileWidth+MAXLINEWIDTH//都在画布右边以外
    ||X2<-MAXLINEWIDTH//都在画布左边以外
    ||Y1<-MAXLINEWIDTH//都在画布上边以外
    ||Y2>TileWidth+MAXLINEWIDTH//都在画布下边以外
    ){
    //不需要绘制
  }else{
    for(let i=0;i<航线.length;i++){
      let line = 航线[i].points;
      let widths = 航线[i].widths;
      let heights = 航线[i].heights;
      let points = [];
      for(let j=0;j<widths.length;j++){
        if((widths[j-1]==0&&widths[j]!=0)||(widths[j]==widths[j-1]&&widths[j]!=0)){
          points.push({lng:line[j].lng,lat:line[j].lat})
          if(j===widths.length-1){
            drawRoute(points,Number(widths[j]),航线[i].color,args);
          }
        }else if(widths[j]==0&&widths[j-1]==0){
          points = [{lng:line[j].lng,lat:line[j].lat}]
        }else if(widths[j]!=widths[j-1]&&j>0){
          drawRoute(points,Number(widths[j-1]),航线[i].color,args);
          points = [{lng:line[j-1].lng,lat:line[j-1].lat}];
          if(widths[j]==0){
            points = [{lng:line[j].lng,lat:line[j].lat}];
          }else{
            points.push({lng:line[j].lng,lat:line[j].lat})
            if(j===widths.length-1){
              drawRoute(points,Number(widths[j]),航线[i].color,args);
            }
          }
        }else if(j==0){
          points = [{lng:line[j].lng,lat:line[j].lat}];
        }
      }
    }
    for(let i=0;i<航线.length;i++){
      let line = 航线[i].points;
      let widths = 航线[i].widths;
      let heights = 航线[i].heights;
      // for(let j=0;j<line.length-1;j++){
      //   drawLine(lngLat2Pixel(line[j].lng,line[j].lat),lngLat2Pixel(line[j+1].lng,line[j+1].lat),航线[i].code,航线[i].color,args);
      //   // drawLine(lngLat2Pixel(line[j].lng,line[j].lat),lngLat2Pixel(line[j+1].lng,line[j+1].lat),i+','+j,航线[i].color,args);
      // }
      let color = 航线[i].color;
      args.ctx.font = '18px monospace';
      args.ctx.strokeStyle=color;
      args.ctx.fillStyle='#000000aa';
      args.ctx.lineWidth=1;
      args.ctx.beginPath();
      for(let j=0;j<line.length-1;j++){
        let text = 航线[i].code;
        // let text = i+','+j;
        let pt1 = {
          x:(lng2Pixel(line[j].lng) - imgX)/imgScale*Math.pow(2,args._LL) - args._i*TileWidth,
          y:(lat2Pixel(line[j].lat) - imgY)/imgScale*Math.pow(2,args._LL) - args._j*TileWidth
        }
        let pt2 = {
          x:(lng2Pixel(line[j+1].lng) - imgX)/imgScale*Math.pow(2,args._LL) - args._i*TileWidth,
          y:(lat2Pixel(line[j+1].lat) - imgY)/imgScale*Math.pow(2,args._LL) - args._j*TileWidth
        }
        let width = args.ctx.measureText(text).width;
        if((pt1.x<-args.ctx.lineWidth-width&&pt2.x<-args.ctx.lineWidth-width)
          ||(pt1.x>TileWidth+args.ctx.lineWidth+width&&pt2.x>TileWidth+args.ctx.lineWidth+width)
          ||(pt1.y<-args.ctx.lineWidth-width&&pt2.y<-args.ctx.lineWidth-width)
          ||(pt1.y>TileWidth+args.ctx.lineWidth+width&&pt2.y>TileWidth+args.ctx.lineWidth-width)){
        }else{
          let distance = Math.sqrt((pt2.x-pt1.x)*(pt2.x-pt1.x)+(pt2.y-pt1.y)*(pt2.y-pt1.y));
          if(distance<width*3||!text||text==''){
            args.ctx.beginPath();
            args.ctx.moveTo(pt1.x,pt1.y);
            args.ctx.lineTo(pt2.x,pt2.y)
            args.ctx.stroke()
          }else{
            args.ctx.beginPath();
            args.ctx.moveTo(pt1.x,pt1.y);
            args.ctx.lineTo(pt1.x + (pt2.x-pt1.x)/distance*(distance-width)/2,pt1.y + (pt2.y-pt1.y)/distance*(distance-width)/2);

            args.ctx.moveTo(pt2.x,pt2.y);
            args.ctx.lineTo(pt2.x - (pt2.x-pt1.x)/distance*(distance-width)/2,pt2.y - (pt2.y-pt1.y)/distance*(distance-width)/2);
            args.ctx.stroke();

            args.ctx.save();
            args.ctx.translate((pt1.x+pt2.x)/2,(pt1.y+pt2.y)/2);
            let radian = Math.atan2(pt2.y-pt1.y,pt2.x-pt1.x);
            args.ctx.rotate(radian);

            args.ctx.textBaseline='middle';
            args.ctx.textAlign='center';
            args.ctx.shadowOffsetX=0;
            args.ctx.shadowOffsetY=0;
            args.ctx.shadowBlur = 2;
            args.ctx.shadowColor = color;
            args.ctx.beginPath();
            args.ctx.fillStyle=color
            args.ctx.fillRect(-width/2,-(width/text.length+8)/2,width,width/text.length+8)
            args.ctx.fillStyle='#000000aa'
            args.ctx.fillText(text,0,0);

            args.ctx.shadowBlur = 0;
            args.ctx.shadowOffsetX=0;
            args.ctx.shadowOffsetY=0;

            // args.ctx.rotate(-radian);
            // args.ctx.translate(-(pt1.x+pt2.x)/2,-(pt1.y+pt2.y)/2);
            args.ctx.restore();//相当于上面两行代码，但是更精确
          }
        }
      }
    }
    let imgPixels = args.ctx.getImageData(0, 0, TileWidth, TileWidth);
    top:
    for(let y = 0; y < imgPixels.height; y++){
      for(let x = 0; x < imgPixels.width; x++){
        let i = (y * 4) * imgPixels.width + x * 4;
        if(imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]>0){
          isDrawed = true
          break top;
        }
      }
    }
  }
  if(isDrawed){
    postMessage({i:args.i,j:args.j,_LL:args._LL,bitmap:args.cvs.transferToImageBitmap(),isDrawed,beginTime:args.beginTime,x:args._i,y:args._j});
  }else{
    postMessage({i:args.i,j:args.j,_LL:args._LL,bitmap:0,isDrawed,beginTime:args.beginTime,x:args._i,y:args._j});
  }
}

function drawRoute(points,width,color,args){
  //普通绘制
  // for(let i=0;i<points.length;i++){
  //   let pt = {
  //     x:(lng2Pixel(points[i].lng) - imgX)/imgScale*Math.pow(2,args._LL) - args._i*TileWidth,
  //     y:(lat2Pixel(points[i].lat) - imgY)/imgScale*Math.pow(2,args._LL) - args._j*TileWidth
  //   }
  //   if(i==0){
  //     args.ctx.lineWidth=width*TileWidth*Math.pow(2,args._LL)/40075016.6855784861531768177614;
  //     args.ctx.lineJoin='round';//bevel|round|miter
  //     args.ctx.lineCap='round';//butt|round|square
  //     args.ctx.strokeStyle=color;
  //     args.ctx.beginPath();
  //     args.ctx.moveTo(pt.x,pt.y);
  //   }else if(i==points.length-1){
  //     args.ctx.lineTo(pt.x,pt.y);
  //     args.ctx.stroke();
  //   }else{
  //     args.ctx.lineTo(pt.x,pt.y);
  //   }
  // }


  //提升性能
  for(let i=0;i<points.length;i++){
    let pt = {
      x:(lng2Pixel(points[i].lng) - imgX)/imgScale*Math.pow(2,args._LL) - args._i*TileWidth,
      y:(lat2Pixel(points[i].lat) - imgY)/imgScale*Math.pow(2,args._LL) - args._j*TileWidth
    }
    if(i==0){
      args.ctx.lineWidth=width*TileWidth*Math.pow(2,args._LL)/40075016.6855784861531768177614;
      args.ctx.lineJoin='round';//bevel|round|miter
      args.ctx.lineCap='round';//butt|round|square
      args.ctx.strokeStyle=color;
      args.ctx.beginPath();
      args.ctx.moveTo(pt.x,pt.y);
    }else if(i==points.length-1){
      args.ctx.lineTo(pt.x,pt.y);
      args.ctx.stroke();
    }else{
      let pt1 = {
        x:(lng2Pixel(points[i-1].lng) - imgX)/imgScale*Math.pow(2,args._LL) - args._i*TileWidth,
        y:(lat2Pixel(points[i-1].lat) - imgY)/imgScale*Math.pow(2,args._LL) - args._j*TileWidth
      }
      let pt2 = pt;
      if((pt1.x<-args.ctx.lineWidth&&pt2.x<-args.ctx.lineWidth)
        ||(pt1.x>TileWidth+args.ctx.lineWidth&&pt2.x>TileWidth+args.ctx.lineWidth)
        ||(pt1.y<-args.ctx.lineWidth&&pt2.y<-args.ctx.lineWidth)
        ||(pt1.y>TileWidth+args.ctx.lineWidth&&pt2.y>TileWidth+args.ctx.lineWidth)){
        args.ctx.moveTo(pt2.x,pt2.y)
      }else{
        args.ctx.lineTo(pt2.x,pt2.y)
      }
    }
  }
}
function drawLine(pt1,pt2,text,color,args){
  pt1 = Object.assign({},pt1);
  pt2 = Object.assign({},pt2);
  pt1.x = (pt1.x - imgX)/imgScale*Math.pow(2,args._LL) - args._i*TileWidth;
  pt1.y = (pt1.y - imgY)/imgScale*Math.pow(2,args._LL) - args._j*TileWidth;
  pt2.x = (pt2.x - imgX)/imgScale*Math.pow(2,args._LL) - args._i*TileWidth;
  pt2.y = (pt2.y - imgY)/imgScale*Math.pow(2,args._LL) - args._j*TileWidth;

  if((pt1.x<0&&pt2.x<0)||(pt1.x>TileWidth&&pt2.x>TileWidth)||(pt1.y<0&&pt2.y<0)&&(pt1.y>TileWidth&&pt2.y>TileWidth)){
    return
  }


  args.ctx.font = '18px monospace';
  args.ctx.strokeStyle=color;
  args.ctx.fillStyle='#ffffff88';
  args.ctx.lineWidth=1;
  let distance = Math.sqrt((pt2.x-pt1.x)*(pt2.x-pt1.x)+(pt2.y-pt1.y)*(pt2.y-pt1.y));
  let width = args.ctx.measureText(text).width;

  if(distance>=width*3&&text&&text!=""){

    args.ctx.beginPath();
    args.ctx.moveTo(pt1.x,pt1.y);
    args.ctx.lineTo(pt1.x + (pt2.x-pt1.x)/distance*(distance-width)/2,pt1.y + (pt2.y-pt1.y)/distance*(distance-width)/2);
    args.ctx.stroke();

    args.ctx.beginPath();
    args.ctx.moveTo(pt2.x,pt2.y);
    args.ctx.lineTo(pt2.x - (pt2.x-pt1.x)/distance*(distance-width)/2,pt2.y - (pt2.y-pt1.y)/distance*(distance-width)/2);
    args.ctx.stroke();

    args.ctx.save();
    args.ctx.translate((pt1.x+pt2.x)/2,(pt1.y+pt2.y)/2);



    let radian = Math.atan2(pt2.y-pt1.y,pt2.x-pt1.x);
    args.ctx.rotate(radian);

    args.ctx.textBaseline='middle';
    args.ctx.textAlign='center';
    args.ctx.shadowOffsetX=0;
    args.ctx.shadowOffsetY=0;
    args.ctx.shadowBlur = 2;
    args.ctx.shadowColor = color;
    args.ctx.beginPath();
    args.ctx.fillStyle=color
    args.ctx.fillRect(-width/2,-(width/text.length+4)/2,width,width/text.length+4)
    args.ctx.fillStyle='#00000088'
    args.ctx.fillText(text,0,0);

    args.ctx.shadowBlur = 0;
    args.ctx.shadowOffsetX=0;
    args.ctx.shadowOffsetY=0;

    // args.ctx.rotate(-radian);
    // args.ctx.translate(-(pt1.x+pt2.x)/2,-(pt1.y+pt2.y)/2);
    args.ctx.restore();
  }else{
    args.ctx.beginPath();
    args.ctx.moveTo(pt1.x,pt1.y);
    args.ctx.lineTo(pt2.x,pt2.y);
    args.ctx.stroke();
  }
}
function lngLat2Pixel(lng,lat){
  return{
    x:lng2Pixel(lng),
    y:lat2Pixel(lat),
  }
}
function lng2Pixel(lng){
  return imgX + TileWidth*imgScale*(lng+180)/360;
}
function lat2Pixel(lat){
  return imgY + (1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 * TileWidth*imgScale;
}