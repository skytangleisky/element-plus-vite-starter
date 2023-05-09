import Tiles from '../tiles.js'
import BaseLayer from './baseLayer.js'
import { tileXY2QuadKey } from '../js/core.js'
import axios from 'axios'
import Worker from '../workers/index.js?worker'
export default class MapLayer extends BaseLayer{
  constructor(){
    super()
    this.mapsTiles = []
    this.平滑 = true
    this.myTiles = new Tiles()
    // this.urlTemplate = {url:'/wstdtiles/{z}/user_{z}_{x}_{y}'}
    // this.urlTemplate = {url:'http://192.168.0.112/wstdtiles/{z}/user_{z}_{x}_{y}'}
    this.tileWidth=256
    this.urlTemplate = {}
    this.跳过 = 0
    this.effect = false
    this.瓦片网格 = false
    this.worker = new Worker()
    this.isHide=false
    this.worker.onmessage = event => {
      for(let k=0;k<this.mapsTiles.length;k++){
        if(this.mapsTiles[k]._LL==event.data.z&&this.mapsTiles[k].i==event.data.i&&this.mapsTiles[k].j==event.data.j){
          if(event.data.bitmap===-1){
            this.mapsTiles.splice(k--,1)
            break;
          }
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
        }
      }
      for(let i=0;i<this.mapsTiles.length;i++){
        let minX = Math.floor((2**this.mapsTiles[i]._LL*(this._X0+1))/(2**this._LL)-1)
        let maxX = Math.ceil((2**this.mapsTiles[i]._LL*(this._X1+1))/(2**this._LL)-1)
        let minY = Math.floor((2**this.mapsTiles[i]._LL*(this._Y0+1))/(2**this._LL)-1)
        let maxY = Math.ceil((2**this.mapsTiles[i]._LL*(this._Y1+1))/(2**this._LL)-1)
        if(minX<=this.mapsTiles[i].i&&this.mapsTiles[i].i<=maxX&&minY<=this.mapsTiles[i].j&&this.mapsTiles[i].j<=maxY){
        }else{
          this.mapsTiles.splice(i--,1)
        }
      }
      // console.log(this.mapsTiles.length)
      this.callback()
    }
    this.worker.onerror = e => {
      throw e
    }
    //this.worker.terminate()
  }
  setSource(template){
    this.mapsTiles=[]
    this.myTiles.clear()
    this.urlTemplate = template
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
    this._X0 = Math.floor((rect.x-obj.imgX)*(2**this._LL)/(2**obj.L)/this.tileWidth);
    this._X1 = Math.ceil((rect.x+rect.w-obj.imgX)*(2**this._LL)/(2**obj.L)/this.tileWidth);
    this._Y0 = Math.floor((rect.y-obj.imgY)*(2**this._LL)/(2**obj.L)/this.tileWidth);
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
        for(let k=0;k<this.mapsTiles.length;k++){
          let tmp = this.mapsTiles[k]
          if(change=='zoom in'){
            if(tmp._LL==this._LL-1&&tmp.i==Math.floor(i/2)&&tmp.j==Math.floor(j/2)&&tmp.cvs){
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
              }else if((tmp.i%2==1||tmp.i%2==-1)&&tmp.j%2==0){
                ctx.drawImage(tmp.cvs,
                0,0,this.tileWidth,this.tileWidth,
                this.tileWidth/2,0,this.tileWidth/2,this.tileWidth/2);
              }else if(tmp.i%2==0&&(tmp.j%2==1||tmp.j%2==-1)){
                ctx.drawImage(tmp.cvs,
                0,0,this.tileWidth,this.tileWidth,
                0,this.tileWidth/2,this.tileWidth/2,this.tileWidth/2);
              }else if((tmp.i%2==1||tmp.i%2==-1)&&(tmp.j%2==1||tmp.j%2==-1)){
                ctx.drawImage(tmp.cvs,
                0,0,this.tileWidth,this.tileWidth,
                this.tileWidth/2,this.tileWidth/2,this.tileWidth/2,this.tileWidth/2);
              }
            }
          }
        }
        let item = {_LL:this._LL,i,j,cvs,_X0:this._X0,_X1:this._X1,_Y0:this._Y0,_Y1:this._Y1,isDrawed:true};
        this.mapsTiles.push(item);
        this.load(item,this.mapsTiles,this.urlTemplate.url)
      }
    }
    callback()
  }
  load(item,tiles,url){
    if(this._X0<=item.i&&item.i<this._X1&&this._Y0<=item.j&&item.j<this._Y1&&item._LL==this._LL){
      let x=item.i%2**item._LL>=0?item.i%2**item._LL:item.i%2**item._LL+2**item._LL;
      let y=item.j%2**item._LL>=0?item.j%2**item._LL:item.j%2**item._LL+2**item._LL;
      let data = this.myTiles.getTile(item._LL,y,x);
      if(data){
        item.cvs = data.cvs;
        item.isDrawed = data.isDrawed;
      }else{
        let src = url.replaceAll('{x}',x).replaceAll('{y}',y).replaceAll('{z}',item._LL).replace('{q}',tileXY2QuadKey(item._LL,y,x))+(url.indexOf('?')==-1?'?t=':'&t=')+Date.now();//?t=xxx防止浏览器本身的缓存机制
        this.worker.postMessage({z:item._LL,y:y,x:x,j:item.j,i:item.i,url:src})
        this.Count++;
        //加载中.setValue(this.Count);
      }
    }else{
      for(let k=0;k<tiles.length;k++){
        if(tiles[k]._LL==item._LL&&tiles[k].i==item.i&&tiles[k].j==item.j){
          tiles.splice(k,1);
        }
      }
      if(this.Count>0){
        this.跳过++;
        // 跳过.setValue(this.跳过)
        console.log('跳过',this.Count)
      }
    }
  }
  delete(callback){
    if(this.urlTemplate.remove){
      let deleteData = [];
      for(let j=this._Y0;j<this._Y1;j++){
        for(let i=this._X0;i<this._X1;i++){
          deleteData.push({z:this._LL,y:j,x:i});
        }
      }
      console.log(deleteData)
      axios.delete(this.urlTemplate.remove+'/',{data:deleteData}).then(res=>{
        this.myTiles.clear()
        this.mapsTiles = []
        console.log('从服务器删除可见地图瓦片成功')
        callback()
      })
    }else{
      this.myTiles.clear()
      this.mapsTiles = []
      callback()
    }
  }
}