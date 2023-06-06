import Tiles from '../tiles.js'
import BaseLayer from './baseLayer.js'
import Task from './task'
import { eventbus } from '~/eventbus/index.ts'
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
    eventbus.on('onmessage',event=>{
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
      while(this.mapsTiles.length>(this._X1-this._X0+1)*(this._Y1-this._Y0+1)){
        this.mapsTiles.shift();
      }
    })
    this.task = new Task(10)
  }
  loadMap(obj,rect,callback){
    if(this.isHide)return
    this.callback = callback
    this.procBoundary(obj,rect)
    for(let j=this._Y0;j<=this._Y1;j++){
      for(let i=this._X0;i<=this._X1;i++){
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
          if(this._LL-tmp._LL>0){
            let n = this._LL-tmp._LL
            if(tmp.i==Math.floor(i/(2**n))&&tmp.j==Math.floor(j/(2**n))&&tmp.cvs){
              ctx.clearRect(0,0,this.tileWidth,this.tileWidth)
              ctx.drawImage(tmp.cvs,
                Math.abs(this.tileWidth*i/(2**n))%this.tileWidth,Math.abs(this.tileWidth*j/(2**n))%this.tileWidth,
                this.tileWidth/(2**n),this.tileWidth/(2**n),
                0,0,this.tileWidth,this.tileWidth,
              );
            }
          }else{
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
  load2(item,tiles,obj){
    setTimeout(()=>{
      if(this._X0<=item.i&&item.i<=this._X1&&this._Y0<=item.j&&item.j<=this._Y1&&item._LL==this._LL){
        this.task.addTask({args:{beginTime:Date.now(),i:item.i,j:item.j,_LL:item._LL,_X0:item._X0,_Y0:item._Y0,_X1:item._X1,_Y1:item._Y1},imgX:obj.imgX,imgY:obj.imgY,imgScale:2**obj.L,TileWidth:this.tileWidth})
      }else{//删除跳过的瓦片
        for(let k=0;k<tiles.length;k++){
          if(tiles[k]._LL==item._LL&&tiles[k].i==item.i&&tiles[k].j==item.j){
            console.log('行政区划跳过')
            tiles.splice(k,1);
          }
        }
      }
    },0)
  }
}