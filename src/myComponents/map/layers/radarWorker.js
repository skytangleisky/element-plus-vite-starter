// import country from './全国县界.js'
export default class RadarWorker{
  constructor(){
    this.isDrawed = false
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
  this.test(args);
  // self.close();
}

onmessage(evt){
  this.imgX = evt.data.imgX;
  this.imgY = evt.data.imgY;
  this.imgScale = evt.data.imgScale;
  this.TileWidth = evt.data.TileWidth;
  this.flag = evt.data.flag

  this.MinLng=evt.data.MinLng;
  this.MaxLng=evt.data.MaxLng;
  this.MinLat=evt.data.MinLat;
  this.MaxLat=evt.data.MaxLat;
  this.POINT = evt.data.POINT;
  let decoder = new TextDecoder()
  this.country = JSON.parse(decoder.decode(evt.data.uint8Array))
  this.draw(evt.data.args);
}
verticalFlowColor(v) {
  const colors = ['#0000ff', '#001cff', '#0038ff', '#0054ff', '#0070ff', '#008cff', '#00a8ff', '#00c4ff', '#00e0ff', '#78ffff', '#ffff50', '#ffe600', '#ffbf00', '#ff9800', '#ff7100', '#ff4a00', '#ff2300', '#fb0000', '#d40000', '#ad0000']
  return v <= -5.4 ? colors[0] : v <= -4.8 ? colors[1] : v <= -4.2 ? colors[2] : v <= -3.6 ? colors[3] : v <= -3 ? colors[4] : v <= -2.4 ? colors[5] : v <= -1.8 ? colors[6] : v <= -1.2 ? colors[7] : v <= -0.6 ? colors[8] : v <= 0 ? colors[9] : v <= 0.6 ? colors[10] : v <= 1.2 ? colors[11] : v <= 1.8 ? colors[12] : v <= 2.4 ? colors[13] : v <= 3 ? colors[14] : v <= 3.6 ? colors[15] : v <= 4.2 ? colors[16] : v <= 4.8 ? colors[17] : v <= 5.4 ? colors[18] : colors[19]
}
test(args){
  this.isDrawed = false;
  if(this.country){
    let X1 = (this.lng2Pixel(this.POINT.lng) - this.imgX)/this.imgScale*Math.pow(2,args._LL) - args._i*this.TileWidth;
    let Y1 = (this.lat2Pixel(this.POINT.lat) - this.imgY)/this.imgScale*Math.pow(2,args._LL) - args._j*this.TileWidth;
    args.ctx.lineWidth=1;
    args.ctx.strokeStyle='#f00';
    args.ctx.lineCap = "round";
    args.ctx.lineJoin = "round";
    let anticlockwise = false
    let g = 30/(2*Math.PI*6378137)*2**args._LL*256
    for(let j=0;j<41;j++){
      let α=this.country[j].α/180*Math.PI
      let β=this.country[j].β/180*Math.PI
      // console.log(this.country[j].α,this.country[j].β)
      // let α=90/180*Math.PI
      // let β=90/180*Math.PI
      for(let i=0;i<=this.country[j].array.length;i++){
        let item = this.country[j].array[i]
        if(item){
          let R1=(i-0.5)*g
          let R2=(i-0.5+1)*g
          // let pt1={
          //   x:X1+R1*Math.cos(α+𝚹*j),
          //   y:Y1+R1*Math.sin(α+𝚹*j),
          // }
          // let pt2={
          //   x:X1+R2*Math.cos(α+𝚹*j),
          //   y:Y1+R2*Math.sin(α+𝚹*j),
          // }
          // let pt3={
          //   x:X1+R2*Math.cos(α+𝚹*(j+1)),
          //   y:Y1+R2*Math.sin(α+𝚹*(j+1)),
          // }
          // let pt4={
          //   x:X1+R1*Math.cos(α+𝚹*(j+1)),
          //   y:Y1+R1*Math.sin(α+𝚹*(j+1)),
          // }

          // if(
          // (pt1.x<0&&pt2.x<0&&pt3.x<0&&pt4.x<0)
          // ||(pt1.x>this.TileWidth&&pt2.x>this.TileWidth&&pt3.x>this.TileWidth&&pt4.x>this.TileWidth)
          // ||(pt1.y<0&&pt2.y<0&&pt3.y<0&&pt4.y<0)
          // ||(pt1.y>this.TileWidth&&pt2.y>this.TileWidth&&pt3.y>this.TileWidth&&pt4.y>this.TileWidth)
          // ){
          if(
            Math.sqrt((X1-128)**2+(Y1-128)**2)-128*Math.sqrt(2)>R2
            ||Math.sqrt((X1-128)**2+(Y1-128)**2)+128*Math.sqrt(2)<R1
            ){
              // console.log('skip')
          }else{
            args.ctx.beginPath()
            // args.ctx.fillStyle='#'+Math.random().toString(16).substring(2, 8).toUpperCase()+'ff';
            if(item.Speed==999){
              args.ctx.fillStyle='transparent';
            }else{
              args.ctx.fillStyle=this.verticalFlowColor(item.Speed)
            }
            args.ctx.strokeStyle=args.ctx.fillStyle
            args.ctx.arc(X1,Y1,R1,β,α,!anticlockwise)
            args.ctx.arc(X1,Y1,R2,α,β,anticlockwise)
            args.ctx.closePath()
            args.ctx.stroke()
            args.ctx.fill()

            // args.ctx.beginPath()
            // args.ctx.moveTo(pt1.x,pt1.y)
            // args.ctx.lineTo(pt2.x,pt2.y)
            // args.ctx.lineTo(pt3.x,pt3.y)
            // args.ctx.lineTo(pt4.x,pt4.y)
            // args.ctx.closePath()
            // args.ctx.stroke()
          }

        }
      }
    }

    let imgPixels = args.ctx.getImageData(0, 0, this.TileWidth, this.TileWidth);
    top:
    for(let y = 0; y < imgPixels.height; y++){
      for(let x = 0; x < imgPixels.width; x++){
        let i = (y * 4) * imgPixels.width + x * 4;
        if(imgPixels.data[i+3]>0){
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

	lng2Pixel(lng){
    return this.imgX + this.TileWidth*this.imgScale*(lng+180)/360;
	}
	lat2Pixel(lat){
	  return this.imgY + (1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 * this.TileWidth*this.imgScale;
	}
}