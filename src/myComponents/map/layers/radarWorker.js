import { wgs84togcj02 } from '../workers/mapUtil.js'
// import country from './全国县界.js'
export default class BorderWorker{
  constructor(){
    this.country = []
    this.MinLng=+180;
    this.MaxLng=-180;
    this.MinLat=+90;
    this.MaxLat=-90;
    this.isDrawed = false
    this.loadStatus = 'unload'
    this.queue = []
  }


draw(args){
  args.cvs = new OffscreenCanvas(this.TileWidth,this.TileWidth);
  var ctx = args.cvs.getContext("2d",{antialias:true});
  // ctx.rect(0,0,20,10);
  // ctx.moveTo(x,0);
  // ctx.strokeStyle="#ff000088";
  // ctx.fillStyle="#00ff0088";
  // ctx.fill();
  // ctx.stroke();
  args.ctx = ctx;
  args._i=args.i%2**args._LL>=0?args.i%2**args._LL:args.i%2**args._LL+2**args._LL;
  args._j=args.j%2**args._LL>=0?args.j%2**args._LL:args.j%2**args._LL+2**args._LL;

  if(this.loadStatus=='loaded'){
    this.test(args);
  }else if(this.loadStatus=='loading'){
    this.queue.push(args);
  }else if(this.loadStatus=='unload'){
    this.loadStatus = 'loading'
    var xhr = new XMLHttpRequest()
    xhr.open('GET','http://data.tanglei.top/全国县界.json',true)
    xhr.responseType = 'json'
    xhr.send()
    xhr.onreadystatechange = () => {
      let res = 'response' in xhr ? xhr.response : xhr.responseText
      if(xhr.readyState === 4 && xhr.status === 200) {
        this.loadStatus = 'loaded'
        this.country = res
        for(let i=0;i<this.country.length;i++){
          let points = this.country[i].points.split(' ');
          let minLng=+180;
          let maxLng=-180;
          let minLat=+90;
          let maxLat=-90;
          for(let k=0;k<points.length;k++){
            let lng = points[k].substring(0,points[k].indexOf('E'));
            let lat = points[k].substring(points[k].indexOf('E')+1,points[k].indexOf('N'));
            points[k] = wgs84togcj02(Number(lng.substring(0,3))+Number(lng.substring(3,5))/60+Number(lng.substring(5,9))/100/3600,Number(lat.substring(0,2))+Number(lat.substring(2,4))/60+Number(lat.substring(4,8))/100/3600);
            // points[k] = [Number(lng.substring(0,3))+Number(lng.substring(3,5))/60+Number(lng.substring(5,9))/100/3600,Number(lat.substring(0,2))+Number(lat.substring(2,4))/60+Number(lat.substring(4,8))/100/3600];
            minLng=points[k][0]<minLng?points[k][0]:minLng;
            maxLng=points[k][0]>maxLng?points[k][0]:maxLng;
            minLat=points[k][1]<minLat?points[k][1]:minLat;
            maxLat=points[k][1]>maxLat?points[k][1]:maxLat;
          }
          this.MinLng=minLng<this.MinLng?minLng:this.MinLng;
          this.MaxLng=maxLng>this.MaxLng?maxLng:this.MaxLng;
          this.MinLat=minLat<this.MinLat?minLat:this.MinLat;
          this.MaxLat=maxLat>this.MaxLat?maxLat:this.MaxLat;

          this.country[i].minLng=minLng;
          this.country[i].maxLng=maxLng;
          this.country[i].minLat=minLat;
          this.country[i].maxLat=maxLat;
          this.country[i].points = points;
        }
        this.test(args)
        for(let i=0;i<this.queue.length;i++){
          let args = this.queue.splice(i--,1)[0]
          this.test(args)
        }
      }else if(xhr.readyState === 4 && (xhr.status === 404||xhr.status === 500)){
        // self.postMessage({z:e.data.z,y:e.data.y,x:e.data.x,i:e.data.i,j:e.data.j,bitmap:0,isDrawed:false})
      }
    }
    xhr.onerror = function(e){
    }
  }
  // self.close();
}

onmessage(evt){
  console.log(evt)
  this.imgX = evt.data.imgX;
  this.imgY = evt.data.imgY;
  this.imgScale = evt.data.imgScale;
  this.TileWidth = evt.data.TileWidth;
  this.flag = evt.data.flag
  this.draw(evt.data.args);
}

test(args){
  this.isDrawed = false;
  if(this.country){
    let X1 = (this.lng2Pixel(this.MinLng) - this.imgX)/this.imgScale*Math.pow(2,args._LL) - args._i*this.TileWidth;
    let X2 = (this.lng2Pixel(this.MaxLng) - this.imgX)/this.imgScale*Math.pow(2,args._LL) - args._i*this.TileWidth;
    let Y1 = (this.lat2Pixel(this.MinLat) - this.imgY)/this.imgScale*Math.pow(2,args._LL) - args._j*this.TileWidth;
    let Y2 = (this.lat2Pixel(this.MaxLat) - this.imgY)/this.imgScale*Math.pow(2,args._LL) - args._j*this.TileWidth;
    args.ctx.lineWidth=1;
    // args.ctx.strokeStyle='#aaaaff';
    args.ctx.strokeStyle='#ff0000';
    args.ctx.lineCap = "round";
    args.ctx.lineJoin = "round";
    // args.ctx.strokeRect(X1,Y1,X2-X1,Y2-Y1)//范围测试
    if(X1>this.TileWidth+args.ctx.lineWidth//都在画布右边以外
      ||X2<-args.ctx.lineWidth//都在画布左边以外
      ||Y1<-args.ctx.lineWidth//都在画布上边以外
      ||Y2>this.TileWidth+args.ctx.lineWidth//都在画布下边以外
      ){
      //不需要绘制
    }else{
      for(let i=0;i<this.country.length;i++){
        let points = this.country[i].points;
        let x1 = (this.lng2Pixel(this.country[i].minLng) - this.imgX)/this.imgScale*Math.pow(2,args._LL) - args._i*this.TileWidth;
        let x2 = (this.lng2Pixel(this.country[i].maxLng) - this.imgX)/this.imgScale*Math.pow(2,args._LL) - args._i*this.TileWidth;
        let y1 = (this.lat2Pixel(this.country[i].minLat) - this.imgY)/this.imgScale*Math.pow(2,args._LL) - args._j*this.TileWidth;
        let y2 = (this.lat2Pixel(this.country[i].maxLat) - this.imgY)/this.imgScale*Math.pow(2,args._LL) - args._j*this.TileWidth;
        // args.ctx.strokeRect(x1,y1,x2-x1,y2-y1)//范围测试
        if(x1>this.TileWidth+args.ctx.lineWidth//都在画布右边以外
          ||x2<-args.ctx.lineWidth//都在画布左边以外
          ||y1<-args.ctx.lineWidth//都在画布上边以外
          ||y2>this.TileWidth+args.ctx.lineWidth//都在画布下边以外
          ){
          //不需要绘制
        }else{
          args.ctx.beginPath();
          for(let k=0;k<points.length-1;k++){
            let pt1 = {
              x:(this.lng2Pixel(points[k][0]) - this.imgX)/this.imgScale*Math.pow(2,args._LL) - args._i*this.TileWidth,
              y:(this.lat2Pixel(points[k][1]) - this.imgY)/this.imgScale*Math.pow(2,args._LL) - args._j*this.TileWidth
            }
            let pt2 = {
              x:(this.lng2Pixel(points[k+1][0]) - this.imgX)/this.imgScale*Math.pow(2,args._LL) - args._i*this.TileWidth,
              y:(this.lat2Pixel(points[k+1][1]) - this.imgY)/this.imgScale*Math.pow(2,args._LL) - args._j*this.TileWidth
            }
            if(k==0){
              args.ctx.moveTo(pt1.x,pt1.y)
            }
            if((pt1.x<-args.ctx.lineWidth&&pt2.x<-args.ctx.lineWidth)
              ||(pt1.x>this.TileWidth+args.ctx.lineWidth&&pt2.x>this.TileWidth+args.ctx.lineWidth)
              ||(pt1.y<-args.ctx.lineWidth&&pt2.y<-args.ctx.lineWidth)
              ||(pt1.y>this.TileWidth+args.ctx.lineWidth&&pt2.y>this.TileWidth+args.ctx.lineWidth)){
              args.ctx.moveTo(pt2.x,pt2.y)
            }else{
              args.ctx.lineTo(pt2.x,pt2.y)
            }
          }
          args.ctx.stroke();
        }
      }
      let imgPixels = args.ctx.getImageData(0, 0, this.TileWidth, this.TileWidth);
      top:
      for(let y = 0; y < imgPixels.height; y++){
        for(let x = 0; x < imgPixels.width; x++){
          let i = (y * 4) * imgPixels.width + x * 4;
          if(imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]>0){
            this.isDrawed = true
            break top;
          }
        }
      }
    }
  }

  // for(let k=0;k<datas.districtList.length;k++){
  //   let district = datas.districtList[k];
  //   if(district.boundaries){
  //     args.ctx.globalCompositeOperation='source-over';
  //     args.ctx.lineWidth=2;
  //     args.ctx.strokeStyle='#0ff';
  //     args.ctx.beginPath();
  //     for(let j=0;j<district.boundaries.length;j++){
  //       let boundary = district.boundaries[j]
  //       let endPt;
  //       for(let i=0;i<boundary.length-1;i++){
  //         let pt1={};
  //         let pt2={};
  //           pt1.x = (this.lng2Pixel(boundary[i].lng) - this.imgX)/this.imgScale*Math.pow(2,args._LL) - args._i*this.TileWidth;
  //           pt1.y = (this.lat2Pixel(boundary[i].lat) - this.imgY)/this.imgScale*Math.pow(2,args._LL) - args._j*this.TileWidth;
  //           pt2.x = (this.lng2Pixel(boundary[i+1].lng) - this.imgX)/this.imgScale*Math.pow(2,args._LL) - args._i*this.TileWidth;
  //           pt2.y = (this.lat2Pixel(boundary[i+1].lat) - this.imgY)/this.imgScale*Math.pow(2,args._LL) - args._j*this.TileWidth;
  
  //           if((pt1.x<0&&pt2.x<0)||(pt1.x>this.TileWidth&&pt2.x>this.TileWidth)||(pt1.y<0&&pt2.y<0)||(pt1.y>this.TileWidth&&pt2.y>this.TileWidth)){
  
  //           }else{
  //             if(JSON.stringify(pt1)!==endPt){
  //               args.ctx.moveTo(pt1.x,pt1.y);
  //             }
  //             args.ctx.lineTo(pt2.x,pt2.y);
  //             endPt=JSON.stringify(pt2);
  //           }
  //       }
  //     }
  //     args.ctx.stroke();
  //   }


  //   args.ctx.globalCompositeOperation='source-over';
  //   args.ctx.lineWidth=1;
  //   args.ctx.strokeStyle='#fff';
  //   args.ctx.beginPath();
  //   for(let c=0;c<district.districtList.length;c++){
  //     let subDistrict = district.districtList[c];
  //     if(subDistrict.boundaries){
  //       for(let b=0;b<subDistrict.boundaries.length;b++){
  //         let boundary = subDistrict.boundaries[b];
  //         let endPt;
  //         for(let i=0;i<boundary.length-1;i++){
  //           let pt1={};
  //           let pt2={};
  //             pt1.x = (this.lng2Pixel(boundary[i].lng) - this.imgX)/this.imgScale*Math.pow(2,args._LL) - args._i*this.TileWidth;
  //             pt1.y = (this.lat2Pixel(boundary[i].lat) - this.imgY)/this.imgScale*Math.pow(2,args._LL) - args._j*this.TileWidth;
  //             pt2.x = (this.lng2Pixel(boundary[i+1].lng) - this.imgX)/this.imgScale*Math.pow(2,args._LL) - args._i*this.TileWidth;
  //             pt2.y = (this.lat2Pixel(boundary[i+1].lat) - this.imgY)/this.imgScale*Math.pow(2,args._LL) - args._j*this.TileWidth;
  //             if((pt1.x<0&&pt2.x<0)||(pt1.x>this.TileWidth&&pt2.x>this.TileWidth)||(pt1.y<0&&pt2.y<0)||(pt1.y>this.TileWidth&&pt2.y>this.TileWidth)){
  //             }else{
  //               if(JSON.stringify(pt1)!==endPt){
  //                 args.ctx.moveTo(pt1.x,pt1.y);
  //               }
  //               args.ctx.lineTo(pt2.x,pt2.y);
  //               endPt=JSON.stringify(pt2);
  //             }
  //         }
  //       }
  //     }
  //   }
  // }
  // args.ctx.closePath();
  // args.ctx.stroke();
  if(this.isDrawed){
    postMessage({i:args.i,j:args.j,_LL:args._LL,bitmap:args.cvs.transferToImageBitmap(),isDrawed:this.isDrawed,beginTime:args.beginTime,x:args._i,y:args._j,flag:this.flag});
  }else{
    postMessage({i:args.i,j:args.j,_LL:args._LL,bitmap:0,isDrawed:this.isDrawed,beginTime:args.beginTime,x:args._i,y:args._j,flag:this.flag});
  }
}

	lng2Pixel(lng){
    return this.imgX + this.TileWidth*this.imgScale*(lng+180)/360;
	}
	lat2Pixel(lat){
	  return this.imgY + (1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 * this.TileWidth*this.imgScale;
	}
}