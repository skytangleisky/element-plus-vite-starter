import Tiles from '../tiles.js'
import BaseLayer from './baseLayer.js'
import Worker from '../workers/point.js?worker'
export default class PointLayer extends BaseLayer{
  constructor(){
    super()
    this.mapsTiles = []
    this.平滑 = true
    this.myTiles = new Tiles()
    this.跳过 = 0
    this.effect = false
    this.瓦片网格 = false
    this.isHide = false
    this.tileWidth=256

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
    if(this.isHide)return
    this.callback = callback
    if(change == 'zoom in'){
      this._LL = Math.floor(obj.L);//放大完成后加载最新层级的图片数据
      // _LL = Math.ceil(obj.L);//放大时加载图片数据
    }else{
      this._LL = Math.floor(obj.L);//缩小时加载图片数据
      // _LL = Math.ceil(obj.L);//缩小完成后加载最新层级的图片数据+缩小时加载同级进入视线的图片数据
    }
    if(this._LL<0)this._LL=0;

    /*显示-∞<lng<+∞,-∞<lat<+∞*/
    this._X0 = Math.floor(rect.x-obj.imgX*2**this._LL/2**obj.L/this.tileWidth);
    this._X1 = Math.ceil((rect.x+rect.w-obj.imgX)*2**this._LL/2**obj.L/this.tileWidth);
    this._Y0 = Math.floor(rect.y-obj.imgY*2**this._LL/2**obj.L/this.tileWidth);
    this._Y1 = Math.ceil((rect.y+rect.h-obj.imgY)*2**this._LL/2**obj.L/this.tileWidth);

    /*显示-180<lng<180,-85.05112877980659<lat<85.05112877980659*/
    // this._X0 = Math.max(rect.x,Math.floor(-obj.imgX*2**this._LL/2**obj.L/this.tileWidth));
    // this._X1 = Math.min(Math.ceil((rect.x+rect.w-obj.imgX)*2**this._LL/2**obj.L/this.tileWidth),2**this._LL);
    // this._Y0 = Math.max(rect.y,Math.floor(-obj.imgY*2**this._LL/2**obj.L/this.tileWidth));
    // this._Y1 = Math.min(Math.ceil((rect.y+rect.h-obj.imgY)*2**this._LL/2**obj.L/this.tileWidth),2**this._LL);



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
        for(let k=0;k<this.mapsTiles.length;k++){
          let tmp = this.mapsTiles[k]
          if(change=='zoom in'){
            let n = this._LL-tmp._LL
            if(tmp.i==Math.floor(i/(2**n))&&tmp.j==Math.floor(j/(2**n))&&tmp.cvs){
              ctx.clearRect(0,0,this.tileWidth,this.tileWidth)
              ctx.drawImage(tmp.cvs,
                Math.abs(this.tileWidth*i/(2**n))%this.tileWidth,Math.abs(this.tileWidth*j/(2**n))%this.tileWidth,
                this.tileWidth/(2**n),this.tileWidth/(2**n),
                0,0,this.tileWidth,this.tileWidth,
              );
            }
          }else if(change=='zoom out'){
            let n = tmp._LL - this._LL
            if(i==Math.floor(tmp.i/(2**n))&&j==Math.floor(tmp.j/(2**n))&&tmp.cvs){
              ctx.clearRect(Math.abs(this.tileWidth*tmp.i/(2**n))%this.tileWidth,Math.abs(this.tileWidth*tmp.j/(2**n))%this.tileWidth,this.tileWidth/(2**n),this.tileWidth/(2**n))
              ctx.drawImage(tmp.cvs,
                0,0,
                this.tileWidth,this.tileWidth,
                Math.abs(this.tileWidth*tmp.i/(2**n))%this.tileWidth,Math.abs(this.tileWidth*tmp.j/(2**n))%this.tileWidth,
                this.tileWidth/(2**n),this.tileWidth/(2**n),
              );
            }
          }
        }
        let item = {_LL:this._LL,i,j,cvs,_X0:this._X0,_X1:this._X1,_Y0:this._Y0,_Y1:this._Y1,isDrawed:true};



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
            this.load2({_LL:this._LL,i,j,_X0:this._X0,_X1:this._X1,_Y0:this._Y0,_Y1:this._Y1,isDrawed:true},this.mapsTiles,obj)
          }
        }
      }
    }
  }
  load2(item,tiles,obj){
    setTimeout(()=>{
      if(this._X0<=item.i&&item.i<this._X1&&this._Y0<=item.j&&item.j<this._Y1&&item._LL==this._LL){
        this.worker.postMessage({args:{beginTime:Date.now(),i:item.i,j:item.j,_LL:item._LL,_X0:item._X0,_Y0:item._Y0,_X1:item._X1,_Y1:item._Y1},imgX:obj.imgX,imgY:obj.imgY,imgScale:2**obj.L,TileWidth:this.tileWidth});//处理这段数据通常需要很长时间。
      }else{//删除跳过的瓦片
        for(let k=0;k<tiles.length;k++){
          if(tiles[k]._LL==item._LL&&tiles[k].i==item.i&&tiles[k].j==item.j){
            // console.log('导航点跳过')
            tiles.splice(k,1);
          }
        }
      }
    },0)
  }
}