export default class RouteLayer{
  constructor(){
    this.isDrawed = false;
    this.MAXLINEWIDTH;
  }
  draw(args){
    this.MAXLINEWIDTH=this.maxLineWidth/2/(2*Math.PI*6378137)*2**args._LL*256;
    args.cvs = new OffscreenCanvas(this.TileWidth,this.TileWidth);
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
    this.test(args)
    // self.close();
  }
  onmessage(evt){
    this.imgX = evt.data.imgX;
    this.imgY = evt.data.imgY;
    this.imgScale = evt.data.imgScale;
    this.TileWidth = evt.data.TileWidth;
    this.flag = evt.data.flag;
    this.maxLineWidth = evt.data.maxLineWidth
    this.MinLng = evt.data.MinLng
    this.MaxLng = evt.data.MaxLng
    this.MinLat = evt.data.MinLat
    this.MaxLat = evt.data.MaxLat
    var that = this
    if(that.航线){
      that.draw(evt.data.args);
    }else{
      var xhr = new XMLHttpRequest();
      xhr.addEventListener("load", function(){
        let decoder = new TextDecoder('utf-8')
        let text = decoder.decode(this.response)
        that.航线 = JSON.parse(text)
        that.draw(evt.data.args);
      });
      xhr.responseType="arraybuffer"
      xhr.open("GET", evt.data.objectUrl);
      xhr.send();
    }
  }
  test(args){
    this.isDrawed = false;
    let X1 = (this.lng2Pixel(this.MinLng) - this.imgX)/this.imgScale*Math.pow(2,args._LL) - args._i*this.TileWidth;
    let X2 = (this.lng2Pixel(this.MaxLng) - this.imgX)/this.imgScale*Math.pow(2,args._LL) - args._i*this.TileWidth;
    let Y1 = (this.lat2Pixel(this.MinLat) - this.imgY)/this.imgScale*Math.pow(2,args._LL) - args._j*this.TileWidth;
    let Y2 = (this.lat2Pixel(this.MaxLat) - this.imgY)/this.imgScale*Math.pow(2,args._LL) - args._j*this.TileWidth;
    // args.ctx.save()
    // args.ctx.lineWidth=.5;
    // args.ctx.strokeStyle='#aaaaff';
    // args.ctx.lineCap = "round";
    // args.ctx.lineJoin = "round";
    // args.ctx.strokeRect(X1,Y1,X2-X1,Y2-Y1)//范围测试
    // args.ctx.restore()
    if(X1>this.TileWidth+this.MAXLINEWIDTH//都在画布右边以外
      ||X2<-this.MAXLINEWIDTH//都在画布左边以外
      ||Y1<-this.MAXLINEWIDTH//都在画布上边以外
      ||Y2>this.TileWidth+this.MAXLINEWIDTH//都在画布下边以外
      ){
      //不需要绘制
    }else{
      for(let i=0;i<this.航线.length;i++){
          let line = this.航线[i].points;
          let widths = this.航线[i].widths;
          let heights = this.航线[i].heights;
          let points = [];
          for(let j=0;j<widths.length;j++){
            if((widths[j-1]==0&&widths[j]!=0)||(widths[j]==widths[j-1]&&widths[j]!=0)){
              points.push({lng:line[j].lng,lat:line[j].lat})
              if(j===widths.length-1){
                this.drawRoute(points,Number(widths[j]),this.航线[i].color,args);
              }
            }else if(widths[j]==0&&widths[j-1]==0){
              points = [{lng:line[j].lng,lat:line[j].lat}]
            }else if(widths[j]!=widths[j-1]&&j>0){
              this.drawRoute(points,Number(widths[j-1]),this.航线[i].color,args);
              points = [{lng:line[j-1].lng,lat:line[j-1].lat}];
              if(widths[j]==0){
                points = [{lng:line[j].lng,lat:line[j].lat}];
              }else{
                points.push({lng:line[j].lng,lat:line[j].lat})
                if(j===widths.length-1){
                  this.drawRoute(points,Number(widths[j]),this.航线[i].color,args);
                }
              }
            }else if(j==0){
              points = [{lng:line[j].lng,lat:line[j].lat}];
            }
          }
      }
      for(let i=0;i<this.航线.length;i++){
        let line = this.航线[i].points;
        let widths = this.航线[i].widths;
        let heights = this.航线[i].heights;
        // for(let j=0;j<line.length-1;j++){
        //   // this.drawLine(this.lngLat2Pixel(line[j].lng,line[j].lat),this.lngLat2Pixel(line[j+1].lng,line[j+1].lat),this.航线[i].code,this.航线[i].color,args);
        //   this.drawLine(this.lngLat2Pixel(line[j].lng,line[j].lat),this.lngLat2Pixel(line[j+1].lng,line[j+1].lat),i+','+j,this.航线[i].color,args);
        // }
        let color = this.航线[i].color;
        args.ctx.font = '18px monospace';
        args.ctx.strokeStyle=color;
        args.ctx.fillStyle='#000000aa';
        args.ctx.lineWidth=1;
        args.ctx.beginPath();
        for(let j=0;j<line.length-1;j++){
          let text = this.航线[i].code;
          // let text = i+','+j;
          let pt1 = {
            x: (this.lng2Pixel(line[j].lng) - this.imgX)/this.imgScale*Math.pow(2,args._LL) - args._i*this.TileWidth,
            y: (this.lat2Pixel(line[j].lat) - this.imgY)/this.imgScale*Math.pow(2,args._LL) - args._j*this.TileWidth,
          }
          let pt2 = {
            x: (this.lng2Pixel(line[j+1].lng) - this.imgX)/this.imgScale*Math.pow(2,args._LL) - args._i*this.TileWidth,
            y: (this.lat2Pixel(line[j+1].lat) - this.imgY)/this.imgScale*Math.pow(2,args._LL) - args._j*this.TileWidth,
          }
          let width = args.ctx.measureText(text).width;

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
    if(this.isDrawed){
      postMessage({i:args.i,j:args.j,_LL:args._LL,bitmap:args.cvs.transferToImageBitmap(),isDrawed:this.isDrawed,beginTime:args.beginTime,x:args._i,y:args._j,flag:this.flag});
    }else{
      postMessage({i:args.i,j:args.j,_LL:args._LL,bitmap:0,isDrawed:true,beginTime:args.beginTime,x:args._i,y:args._j,flag:this.flag});
    }
  }
  drawRoute(points,width,color,args){
    //普通绘制
    // for(let i=0;i<points.length;i++){
    //   let pt = {
    //     x:(this.lng2Pixel(points[i].lng) - this.imgX)/this.imgScale*Math.pow(2,args._LL) - args._i*this.TileWidth,
    //     y:(this.lat2Pixel(points[i].lat) - this.imgY)/this.imgScale*Math.pow(2,args._LL) - args._j*this.TileWidth
    //   }
    //   if(i==0){
    //     args.ctx.lineWidth=width/2/(2*Math.PI*6378137)*2**args._LL*256;
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
        x:(this.lng2Pixel(points[i].lng) - this.imgX)/this.imgScale*Math.pow(2,args._LL) - args._i*this.TileWidth,
        y:(this.lat2Pixel(points[i].lat) - this.imgY)/this.imgScale*Math.pow(2,args._LL) - args._j*this.TileWidth
      }
      if(i==0){
        args.ctx.lineWidth=width/2/(2*Math.PI*6378137)*2**args._LL*256;
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
          x:(this.lng2Pixel(points[i-1].lng) - this.imgX)/this.imgScale*Math.pow(2,args._LL) - args._i*this.TileWidth,
          y:(this.lat2Pixel(points[i-1].lat) - this.imgY)/this.imgScale*Math.pow(2,args._LL) - args._j*this.TileWidth
        }
        let pt2 = pt;
        if((pt1.x<-args.ctx.lineWidth&&pt2.x<-args.ctx.lineWidth)
          ||(pt1.x>this.TileWidth+args.ctx.lineWidth&&pt2.x>this.TileWidth+args.ctx.lineWidth)
          ||(pt1.y<-args.ctx.lineWidth&&pt2.y<-args.ctx.lineWidth)
          ||(pt1.y>this.TileWidth+args.ctx.lineWidth&&pt2.y>this.TileWidth+args.ctx.lineWidth)){
          args.ctx.moveTo(pt2.x,pt2.y)
        }else{
          args.ctx.lineTo(pt2.x,pt2.y)
        }
      }
    }
  }
  drawLine(pt1,pt2,text,color,args){
    pt1 = Object.assign({},pt1);
    pt2 = Object.assign({},pt2);
    pt1.x = (pt1.x - this.imgX)/this.imgScale*Math.pow(2,args._LL) - args._i*this.TileWidth;
    pt1.y = (pt1.y - this.imgY)/this.imgScale*Math.pow(2,args._LL) - args._j*this.TileWidth;
    pt2.x = (pt2.x - this.imgX)/this.imgScale*Math.pow(2,args._LL) - args._i*this.TileWidth;
    pt2.y = (pt2.y - this.imgY)/this.imgScale*Math.pow(2,args._LL) - args._j*this.TileWidth;

    if((pt1.x<0&&pt2.x<0)||(pt1.x>this.TileWidth&&pt2.x>this.TileWidth)||(pt1.y<0&&pt2.y<0)&&(pt1.y>this.TileWidth&&pt2.y>this.TileWidth)){
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
  lngLat2Pixel(lng,lat){
    return{
      x:this.lng2Pixel(lng),
      y:this.lat2Pixel(lat),
    }
  }
  lng2Pixel(lng){
    return this.imgX + this.TileWidth*this.imgScale*(lng+180)/360;
  }
  lat2Pixel(lat){
    return this.imgY + (1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 * this.TileWidth*this.imgScale;
  }
}
