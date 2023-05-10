import Tiles from '../tiles.js'
import BaseLayer from './baseLayer.js'
import Worker from '../workers/border.js?worker'
export default class BorderLayer extends BaseLayer{
  constructor(){
    super()
    this.tileWidth = 256
    this.mapsTiles = []
    this.平滑 = true
    this.myTiles = new Tiles()
    this.跳过 = 0
    this.effect = false
    this.瓦片网格 = false
    this.isHide=false

    this.worker = new Worker();//一个对象加快访问速度
    this.worker.onmessage = (event)=>{
      // console.log((Date.now()-event.data.beginTime)/1000);
      for(let k=0;k<this.mapsTiles.length;k++){
        if(this.mapsTiles[k]._LL==event.data._LL&&this.mapsTiles[k].i==event.data.i&&this.mapsTiles[k].j==event.data.j){
          if(event.data.isDrawed){
            var cvs2 = document.createElement('canvas');
            cvs2.setAttribute("width",256);
            cvs2.setAttribute("height",256);
            cvs2.getContext('bitmaprenderer').transferFromImageBitmap(event.data.bitmap);
            this.mapsTiles[k].cvs = cvs2;
            this.mapsTiles[k].isDrawed = event.data.isDrawed;
          }else{
            this.mapsTiles[k].cvs = 0;
            this.mapsTiles[k].isDrawed = event.data.isDrawed;
          }
          this.myTiles.addTile(this.mapsTiles[k]._LL,event.data.y,event.data.x,{cvs:this.mapsTiles[k].cvs,isDrawed:event.data.isDrawed});
          // rAF(draw);
          this.callback()
        }
      }
      while(this.mapsTiles.length>(this._X1-this._X0)*(this._Y1-this._Y0)){
        this.mapsTiles.shift();
      }
    }
  }
  loadMap(obj,change,rect,callback){
    this.callback = callback
    if(this.isHide){
      this.mapsTiles = []
      callback()
      return
    }
    if(change == 'zoom in'){
      this._LL = Math.floor(obj.L);//放大完成后加载最新层级的图片数据
      // _LL = Math.ceil(obj.L);//放大时加载图片数据
    }else{
      this._LL = Math.floor(obj.L);//缩小时加载图片数据
      // _LL = Math.ceil(obj.L);//缩小完成后加载最新层级的图片数据+缩小时加载同级进入视线的图片数据
    }
    if(this._LL<0)this._LL=0;

    /*显示-∞<lng<+∞,-∞<lat<+∞*/
    this._X0 = Math.floor(rect.x-obj.imgX*(2**this._LL)/(2**obj.L)/this.tileWidth);
    this._X1 = Math.ceil((rect.x+rect.w-obj.imgX)*(2**this._LL)/(2**obj.L)/this.tileWidth);
    this._Y0 = Math.floor(rect.y-obj.imgY*(2**this._LL)/(2**obj.L)/this.tileWidth);
    this._Y1 = Math.ceil((rect.y+rect.h-obj.imgY)*(2**this._LL)/(2**obj.L)/this.tileWidth);

    /*显示-180<lng<180,-85.05112877980659<lat<85.05112877980659*/
    // this._X0 = Math.max(rect.x,Math.floor(-obj.imgX*(2**this._LL)/(2**obj.L)/this.tileWidth));
    // this._X1 = Math.min(Math.ceil((rect.w-obj.imgX)*(2**this._LL)/(2**obj.L)/this.tileWidth),2**this._LL);
    // this._Y0 = Math.max(rect.y,Math.floor(-obj.imgY*(2**this._LL)/(2**obj.L)/this.tileWidth));
    // this._Y1 = Math.min(Math.ceil((rect.h-obj.imgY)*(2**this._LL)/(2**obj.L)/this.tileWidth),2**this._LL);


    for(let j=this._Y0;j<this._Y1;j++){
      for(let i=this._X0;i<this._X1;i++){
        let mapExist = false;
        for(let k=this.mapsTiles.length-1;k>=0;k--){
          if(this.mapsTiles[k]._LL==this._LL&&this.mapsTiles[k].i==i&&this.mapsTiles[k].j==j){
            mapExist = true;
            this.mapsTiles.push(this.mapsTiles.splice(k,1)[0]);
            break;
          }
        }
        if(mapExist){
          continue;
        }
        var cvs = document.createElement('canvas');
        cvs.setAttribute("width",this.tileWidth);
        cvs.setAttribute("height",this.tileWidth);
        var ctx = cvs.getContext('2d');
        this.平滑||(ctx.imageSmoothingEnabled = false);
        let isDrawed = false;
        let quadrant = [false,false,false,false]
        for(let k=0;k<this.mapsTiles.length;k++){
          let tmp = this.mapsTiles[k]
          if(change=='zoom in'){
            if(tmp._LL==this._LL-1&&tmp.i==Math.floor(i/2)&&tmp.j==Math.floor(j/2)&&tmp.cvs){
              isDrawed = tmp.isDrawed
              if(i%2==0&&j%2==0){
                ctx.drawImage(tmp.cvs,
                0,0,this.tileWidth/2,this.tileWidth/2,
                0,0,this.tileWidth,this.tileWidth);
              }else if((i%2==1||i%2==-1)&&j%2==0){
                ctx.drawImage(tmp.cvs,
                this.tileWidth/2,0,this.tileWidth/2,this.tileWidth/2,
                0,0,this.tileWidth,this.tileWidth);
              }else if(i%2==0&&(j%2==1||j%2==-1)){
                ctx.drawImage(tmp.cvs,
                0,this.tileWidth/2,this.tileWidth/2,this.tileWidth/2,
                0,0,this.tileWidth,this.tileWidth);
              }else if((i%2==1||i%2==-1)&&(j%2==1||j%2==-1)){
                ctx.drawImage(tmp.cvs,
                this.tileWidth/2,this.tileWidth/2,this.tileWidth/2,this.tileWidth/2,
                0,0,this.tileWidth,this.tileWidth);
              }
            }
          }else if(change=='zoom out'){
            if(tmp._LL==this._LL+1&&Math.floor(tmp.i/2)==i&&Math.floor(tmp.j/2)==j&&tmp.cvs){
              if(tmp.i%2==0&&tmp.j%2==0){
                ctx.drawImage(tmp.cvs,
                0,0,this.tileWidth,this.tileWidth,
                0,0,this.tileWidth/2,this.tileWidth/2);
                tmp.isDrawed&&(quadrant[1]=true)
              }else if((tmp.i%2==1||tmp.i%2==-1)&&tmp.j%2==0){
                ctx.drawImage(tmp.cvs,
                0,0,this.tileWidth,this.tileWidth,
                this.tileWidth/2,0,this.tileWidth/2,this.tileWidth/2);
                tmp.isDrawed&&(quadrant[0]=true)
              }else if(tmp.i%2==0&&(tmp.j%2==1||tmp.j%2==-1)){
                ctx.drawImage(tmp.cvs,
                0,0,this.tileWidth,this.tileWidth,
                0,this.tileWidth/2,this.tileWidth/2,this.tileWidth/2);
                tmp.isDrawed&&(quadrant[2]=true)
              }else if((tmp.i%2==1||tmp.i%2==-1)&&(tmp.j%2==1||tmp.j%2==-1)){
                ctx.drawImage(tmp.cvs,
                0,0,this.tileWidth,this.tileWidth,
                this.tileWidth/2,this.tileWidth/2,this.tileWidth/2,this.tileWidth/2);
                tmp.isDrawed&&(quadrant[3]=true)
              }
            }
          }
        }
        let item = {_LL:this._LL,i,j,cvs,_X0:this._X0,_X1:this._X1,_Y0:this._Y0,_Y1:this._Y1,isDrawed:isDrawed||quadrant[0]||quadrant[1]||quadrant[2]||quadrant[3]};



        let x=item.i%2**item._LL>=0?item.i%2**item._LL:item.i%2**item._LL+2**item._LL;
        let y=item.j%2**item._LL>=0?item.j%2**item._LL:item.j%2**item._LL+2**item._LL;
        if(this._X0<=item.i&&item.i<this._X1&&this._Y0<=item.j&&item.j<this._Y1&&item._LL==this._LL){
          let data = this.myTiles.getTile(item._LL,y,x);
          if(data){
            item.cvs = data.cvs;
            item.isDrawed = data.isDrawed;
            this.mapsTiles.push(item);
          }else{
            this.mapsTiles.push(item);
            // this.load2(i,j,this._LL,this._X0,this._Y0,this._X1,this._Y1,obj)
            this.load2({_LL:this._LL,i,j,_X0:this._X0,_X1:this._X1,_Y0:this._Y0,_Y1:this._Y1,isDrawed:true},obj)
          }
        }
      }
    }
    callback()
  }
  load2(item,obj){
    this.worker.postMessage({args:{beginTime:Date.now(),i:item.i,j:item.j,_LL:item._LL,_X0:item._X0,_Y0:item._Y0,_X1:item._X1,_Y1:item._Y1},imgX:obj.imgX,imgY:obj.imgY,imgScale:2**obj.L,TileWidth:this.tileWidth});//处理这段数据通常需要很长时间。
  }
}