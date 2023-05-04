// import country from './全国县界.js'
let country = []
import { wgs84togcj02 } from './mapUtil.js'
let MinLng=+180;
let MaxLng=-180;
let MinLat=+90;
let MaxLat=-90;
let isDrawed = false;
let loadStatus = 'unload'
let queue = []
function draw(args){
  args.cvs = new OffscreenCanvas(TileWidth,TileWidth);
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


  if(loadStatus=='loaded'){
    test(args);
  }else if(loadStatus=='loading'){
    queue.push(args);
  }else if(loadStatus=='unload'){
    loadStatus = 'loading'
    var xhr = new XMLHttpRequest()
    xhr.open('GET','/data/全国县界.json',true)
    xhr.responseType = 'json'
    xhr.send()
    xhr.onreadystatechange = function() {
      let res = 'response' in xhr ? xhr.response : xhr.responseText
      if(xhr.readyState === 4 && xhr.status === 200) {
        loadStatus = 'loaded'
        country = res
        for(let i=0;i<country.length;i++){
          let points = country[i].points.split(' ');
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
          MinLng=minLng<MinLng?minLng:MinLng;
          MaxLng=maxLng>MaxLng?maxLng:MaxLng;
          MinLat=minLat<MinLat?minLat:MinLat;
          MaxLat=maxLat>MaxLat?maxLat:MaxLat;

          country[i].minLng=minLng;
          country[i].maxLng=maxLng;
          country[i].minLat=minLat;
          country[i].maxLat=maxLat;
          country[i].points = points;
        }
        test(args)
        for(let i=0;i<queue.length;i++){
          let args = queue.splice(i--,1)[0]
          test(args)
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
  if(country){
    let X1 = (lng2Pixel(MinLng) - imgX)/imgScale*Math.pow(2,args._LL) - args._i*TileWidth;
    let X2 = (lng2Pixel(MaxLng) - imgX)/imgScale*Math.pow(2,args._LL) - args._i*TileWidth;
    let Y1 = (lat2Pixel(MinLat) - imgY)/imgScale*Math.pow(2,args._LL) - args._j*TileWidth;
    let Y2 = (lat2Pixel(MaxLat) - imgY)/imgScale*Math.pow(2,args._LL) - args._j*TileWidth;
    args.ctx.lineWidth=1;
    args.ctx.strokeStyle='#aaaaff';
    args.ctx.lineCap = "round";
    args.ctx.lineJoin = "round";
    // args.ctx.strokeRect(X1,Y1,X2-X1,Y2-Y1)//范围测试
    if(X1>TileWidth+args.ctx.lineWidth//都在画布右边以外
      ||X2<-args.ctx.lineWidth//都在画布左边以外
      ||Y1<-args.ctx.lineWidth//都在画布上边以外
      ||Y2>TileWidth+args.ctx.lineWidth//都在画布下边以外
      ){
      //不需要绘制
    }else{
      for(let i=0;i<country.length;i++){
        let points = country[i].points;
        let x1 = (lng2Pixel(country[i].minLng) - imgX)/imgScale*Math.pow(2,args._LL) - args._i*TileWidth;
        let x2 = (lng2Pixel(country[i].maxLng) - imgX)/imgScale*Math.pow(2,args._LL) - args._i*TileWidth;
        let y1 = (lat2Pixel(country[i].minLat) - imgY)/imgScale*Math.pow(2,args._LL) - args._j*TileWidth;
        let y2 = (lat2Pixel(country[i].maxLat) - imgY)/imgScale*Math.pow(2,args._LL) - args._j*TileWidth;
        // args.ctx.strokeRect(x1,y1,x2-x1,y2-y1)//范围测试
        if(x1>TileWidth+args.ctx.lineWidth//都在画布右边以外
          ||x2<-args.ctx.lineWidth//都在画布左边以外
          ||y1<-args.ctx.lineWidth//都在画布上边以外
          ||y2>TileWidth+args.ctx.lineWidth//都在画布下边以外
          ){
          //不需要绘制
        }else{
          args.ctx.beginPath();
          for(let k=0;k<points.length-1;k++){
            let pt1 = {
              x:(lng2Pixel(points[k][0]) - imgX)/imgScale*Math.pow(2,args._LL) - args._i*TileWidth,
              y:(lat2Pixel(points[k][1]) - imgY)/imgScale*Math.pow(2,args._LL) - args._j*TileWidth
            }
            let pt2 = {
              x:(lng2Pixel(points[k+1][0]) - imgX)/imgScale*Math.pow(2,args._LL) - args._i*TileWidth,
              y:(lat2Pixel(points[k+1][1]) - imgY)/imgScale*Math.pow(2,args._LL) - args._j*TileWidth
            }
            if(k==0){
              args.ctx.moveTo(pt1.x,pt1.y)
            }
            if((pt1.x<-args.ctx.lineWidth&&pt2.x<-args.ctx.lineWidth)
              ||(pt1.x>TileWidth+args.ctx.lineWidth&&pt2.x>TileWidth+args.ctx.lineWidth)
              ||(pt1.y<-args.ctx.lineWidth&&pt2.y<-args.ctx.lineWidth)
              ||(pt1.y>TileWidth+args.ctx.lineWidth&&pt2.y>TileWidth+args.ctx.lineWidth)){
              args.ctx.moveTo(pt2.x,pt2.y)
            }else{
              args.ctx.lineTo(pt2.x,pt2.y)
            }
          }
          args.ctx.stroke();
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
  //           pt1.x = (lng2Pixel(boundary[i].lng) - imgX)/imgScale*Math.pow(2,args._LL) - args._i*TileWidth;
  //           pt1.y = (lat2Pixel(boundary[i].lat) - imgY)/imgScale*Math.pow(2,args._LL) - args._j*TileWidth;
  //           pt2.x = (lng2Pixel(boundary[i+1].lng) - imgX)/imgScale*Math.pow(2,args._LL) - args._i*TileWidth;
  //           pt2.y = (lat2Pixel(boundary[i+1].lat) - imgY)/imgScale*Math.pow(2,args._LL) - args._j*TileWidth;
  
  //           if((pt1.x<0&&pt2.x<0)||(pt1.x>TileWidth&&pt2.x>TileWidth)||(pt1.y<0&&pt2.y<0)||(pt1.y>TileWidth&&pt2.y>TileWidth)){
  
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
  //             pt1.x = (lng2Pixel(boundary[i].lng) - imgX)/imgScale*Math.pow(2,args._LL) - args._i*TileWidth;
  //             pt1.y = (lat2Pixel(boundary[i].lat) - imgY)/imgScale*Math.pow(2,args._LL) - args._j*TileWidth;
  //             pt2.x = (lng2Pixel(boundary[i+1].lng) - imgX)/imgScale*Math.pow(2,args._LL) - args._i*TileWidth;
  //             pt2.y = (lat2Pixel(boundary[i+1].lat) - imgY)/imgScale*Math.pow(2,args._LL) - args._j*TileWidth;
  
  //             if((pt1.x<0&&pt2.x<0)||(pt1.x>TileWidth&&pt2.x>TileWidth)||(pt1.y<0&&pt2.y<0)||(pt1.y>TileWidth&&pt2.y>TileWidth)){
  
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
  if(isDrawed){
    postMessage({i:args.i,j:args.j,_LL:args._LL,bitmap:args.cvs.transferToImageBitmap(),isDrawed,beginTime:args.beginTime,x:args._i,y:args._j});
  }else{
    postMessage({i:args.i,j:args.j,_LL:args._LL,bitmap:0,isDrawed,beginTime:args.beginTime,x:args._i,y:args._j});
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