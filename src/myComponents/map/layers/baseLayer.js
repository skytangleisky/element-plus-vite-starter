import { tileXY2QuadKey } from '../js/core.js'
export default class BaseLayer{
  render(obj,context){
    for(let k=Math.max(this.mapsTiles.length - (this._X1-this._X0)*(this._Y1-this._Y0),0);k<this.mapsTiles.length;k++){// map
      let tmp = this.mapsTiles[k]
      if(tmp._LL==this._LL||(tmp._LL==0&&Math.floor(obj.L)<0)){
        this.drawTiles(obj,context,tmp,true);
      }
    }
  }
  drawTiles(obj,context,tmp,flag=false){
    if(tmp.cvs&&tmp.isDrawed&&!this.isHide){
      let dxy = this.tileWidth*2**obj.L/2**tmp._LL;
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
      context.globalCompositeOperation='source-over';
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
        context.strokeRect(obj.imgX + tmp.i*dxy,obj.imgY + tmp.j*dxy,dxy,dxy);
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