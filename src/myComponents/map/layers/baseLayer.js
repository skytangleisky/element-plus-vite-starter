import { tileXY2QuadKey } from '../js/core.js'
export default class BaseLayer{
  procBoundary(obj,rect){
    if(obj.targetL>obj.L){
      this._LL = Math.floor(obj.L);//放大完成后加载最新层级的图片数据
      // this._LL = Math.ceil(obj.L);//放大时加载图片数据
    }else{
      this._LL = Math.floor(obj.L);//缩小时加载图片数据
      // this._LL = Math.ceil(obj.L);//缩小完成后加载最新层级的图片数据+缩小时加载同级进入视线的图片数据
    }
    if(this._LL<0)this._LL=0;

    /*显示-∞<lng<+∞,-∞<lat<+∞*/
    this._X0 = Math.floor((rect.x-obj.imgX)*(2**this._LL)/(2**obj.L)/this.tileWidth);
    this._X1 = Math.floor((rect.x+rect.w-obj.imgX)*(2**this._LL)/(2**obj.L)/this.tileWidth);
    this._Y0 = Math.floor((rect.y-obj.imgY)*(2**this._LL)/(2**obj.L)/this.tileWidth);
    this._Y1 = Math.floor((rect.y+rect.h-obj.imgY)*(2**this._LL)/(2**obj.L)/this.tileWidth);

    /*显示-180<lng<180,-85.05112877980659<lat<85.05112877980659*/
    // this._X0 = Math.max(rect.x,Math.floor(-obj.imgX*(2**this._LL)/(2**obj.L)/this.tileWidth));
    // this._X1 = Math.min(Math.floor((rect.w-obj.imgX)*(2**this._LL)/(2**obj.L)/this.tileWidth),2**this._LL);
    // this._Y0 = Math.max(rect.y,Math.floor(-obj.imgY*(2**this._LL)/(2**obj.L)/this.tileWidth));
    // this._Y1 = Math.min(Math.floor((rect.h-obj.imgY)*(2**this._LL)/(2**obj.L)/this.tileWidth),2**this._LL);

    this._M0 = (rect.x-obj.imgX)/(2**obj.L)/this.tileWidth
    this._M1 = (rect.x+rect.w-obj.imgX)/(2**obj.L)/this.tileWidth
    this._N0 = (rect.y-obj.imgY)/(2**obj.L)/this.tileWidth
    this._N1 = (rect.y+rect.h-obj.imgY)/(2**obj.L)/this.tileWidth
  }
  render(obj,context){
    for(let k=Math.max(this.mapsTiles.length - (this._X1-this._X0+1)*(this._Y1-this._Y0+1),0);k<this.mapsTiles.length;k++){// map
      let tmp = this.mapsTiles[k]
      if(this.urlTemplate&&tmp.url==this.urlTemplate.url){//为地图的情况
        if(tmp._LL==this._LL||(tmp._LL==0&&Math.floor(obj.L)<0)){
          this.drawTiles(obj,context,tmp,true);
        }
      }else if(tmp._LL==this._LL||(tmp._LL==0&&Math.floor(obj.L)<0)){//非地图的情况
        this.drawTiles(obj,context,tmp,true);
      }
    }
  }
  drawTiles(obj,context,tmp,flag=false){
    let dxy = this.tileWidth*2**obj.L/2**tmp._LL;
    context.clearRect(Math.round(obj.imgX+tmp.i*dxy),Math.round(obj.imgY+tmp.j*dxy),Math.round(obj.imgX+(tmp.i+1)*dxy)-Math.round(obj.imgX+tmp.i*dxy),Math.round(obj.imgY+(tmp.j+1)*dxy)-Math.round(obj.imgY+tmp.j*dxy))
    if(tmp.cvs&&tmp.isDrawed&&!this.isHide){
      this.平滑||(context.imageSmoothingEnabled = false);
      context.drawImage(
        tmp.cvs,
        0,0,
        tmp.cvs.width,tmp.cvs.height,
        Math.round(obj.imgX+tmp.i*dxy),
        Math.round(obj.imgY+tmp.j*dxy),
        Math.round(obj.imgX+(tmp.i+1)*dxy)-Math.round(obj.imgX+tmp.i*dxy),
        Math.round(obj.imgY+(tmp.j+1)*dxy)-Math.round(obj.imgY+tmp.j*dxy)
      );
      // context.drawImage(
      //   tmp.cvs,
      //   0,0,
      //   tmp.cvs.width,tmp.cvs.height,
      //   obj.imgX+tmp.i*dxy,
      //   obj.imgY+tmp.j*dxy,
      //   dxy,
      //   dxy
      // );
      if(this.瓦片网格&&flag){
        context.font = '12px kaiti';
        context.textAlign='center';
        context.fillStyle='#ff0';
        context.shadowOffsetX=0;//用来设定阴影在 X轴的延伸距
        context.shadowOffsetY=0;//用来设定阴影在 Y轴的延伸距
        context.shadowBlur = 2;//设定阴影的模糊程度 无0
        context.shadowColor = "rgba(0, 0, 0, 1.0)";//设定阴影颜色效果
        context.textBaseline='bottom';
        context.fillText(`Z:${tmp._LL} Y:${tmp.j} X:${tmp.i}`,obj.imgX + (tmp.i+0.5)*dxy,obj.imgY + (tmp.j+0.5)*dxy);
        context.textBaseline='top';
        context.fillText(`Q:${tileXY2QuadKey(tmp._LL,tmp.j,tmp.i)}`,obj.imgX + (tmp.i+0.5)*dxy,obj.imgY + (tmp.j+0.5)*dxy);
        context.strokeStyle='#f0f';
        context.shadowBlur = 0;
        context.strokeRect(Math.round(obj.imgX+tmp.i*dxy),Math.round(obj.imgY+tmp.j*dxy),Math.round(obj.imgX+(tmp.i+1)*dxy)-Math.round(obj.imgX+tmp.i*dxy),Math.round(obj.imgY+(tmp.j+1)*dxy)-Math.round(obj.imgY+tmp.j*dxy))
      }
    }
  }
  hide(){
    this.isHide=true
  }
  show(){
    this.isHide=false
  }
}