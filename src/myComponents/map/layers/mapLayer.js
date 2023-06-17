import Tiles from '../tiles.js'
import BaseLayer from './baseLayer.js'
import axios from 'axios'
import Worker from '../workers/map.js?worker'
import { eventbus } from '~/eventbus'
export default class MapLayer extends BaseLayer{
  constructor(){
    super()
    this.mapsTiles = []
    this.平滑 = true
    this.myTiles = new Tiles()
    // this.urlTemplate = {url:'/wstdtiles/{z}/user_{z}_{x}_{y}'}
    // this.urlTemplate = {url:'http://192.168.0.112/wstdtiles/{z}/user_{z}_{x}_{y}'}
    this.Count=0
    this.tileWidth=256
    this.urlTemplate = {}
    this.跳过 = 0
    this.cache = true
    this.effect = false
    this.瓦片网格 = false
    this.worker = new Worker()
    this.isHide=false
    this.NUM=0
    this.worker.onmessage = event => {
      this.Count--
      for(let k=0;k<this.mapsTiles.length;k++){
        if(this.mapsTiles[k]._LL==event.data.z&&this.mapsTiles[k].i==event.data.i&&this.mapsTiles[k].j==event.data.j&&this.mapsTiles[k].url==event.data.url){
          if(event.data.bitmap===-1&&this.mapsTiles[k].same==false){
            this.mapsTiles.splice(k--,1)
            break;
          }else if(event.data.bitmap===0){
            if(event.data.isDrawed){
              var cvs2 = document.createElement('canvas');
              cvs2.width=256
              cvs2.height=256
              this.mapsTiles[k].cvs = cvs2;
              this.mapsTiles[k].isDrawed = event.data.isDrawed;
            }else{
              this.mapsTiles[k].cvs = 0;
              this.mapsTiles[k].isDrawed = event.data.isDrawed;
            }
          }else{
            try {
              var cvs2 = document.createElement('canvas');
              cvs2.width=256
              cvs2.height=256
              cvs2.getContext('bitmaprenderer').transferFromImageBitmap(event.data.bitmap);
              this.mapsTiles[k].cvs = cvs2;
              this.mapsTiles[k].isDrawed = event.data.isDrawed;
              // console.log(this.Count)
            } catch (error) {
              this.mapsTiles.splice(k--,1)
              break;
              console.log(error)
            }

          }
          this.cache&&this.myTiles.addTile(this.mapsTiles[k]._LL,event.data.y,event.data.x,{cvs:this.mapsTiles[k].cvs,isDrawed:event.data.isDrawed});
          this.cache&&this.NUM++
          eventbus.emit('systemInfo',{tiles:this.NUM.toString()})
        }
      }
      for(let i=0;i<this.mapsTiles.length;i++){
        let minX = Math.floor((2**this.mapsTiles[i]._LL)*this._M0)
        let maxX = Math.floor((2**this.mapsTiles[i]._LL)*this._M1)
        let minY = Math.floor((2**this.mapsTiles[i]._LL)*this._N0)
        let maxY = Math.floor((2**this.mapsTiles[i]._LL)*this._N1)
        if(this.mapsTiles[i].i<minX||maxX<this.mapsTiles[i].i||this.mapsTiles[i].j<minY||maxY<this.mapsTiles[i].j){
          this.mapsTiles.splice(i--,1)
        }
      }
      if(this.myTiles.Count>10000){
        this.myTiles.clear()
        this.NUM=0
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
    this.NUM=0
    // this.mapsTiles=[]
    this.myTiles.clear()
    this.urlTemplate = template
    if(this._X0!=undefined&&this._X1!=undefined&&this._Y0!=undefined&&this._Y1!=undefined){
      for(let i=0;i<this.mapsTiles.length-(this._X1-this._X0+1)*(this._Y1-this._Y0+1);i++){
        if(this.mapsTiles[i]._LL!=this._LL){
          this.mapsTiles.splice(i--,1)
        }
      }
    }
  }
  loadMap(obj,rect,callback){
    if(this.isHide)return
    this.callback = callback
    this.procBoundary(obj,rect)

    let arr=[]
    for(let k=0;k<this.mapsTiles.length;k++){
      if(this.mapsTiles[k].url==this.urlTemplate.url){
        arr.push(this.mapsTiles.splice(k--,1)[0])
      }
    }
    arr.forEach(v=>{
      this.mapsTiles.push(v)
    })
    for(let j=this._Y0;j<=this._Y1;j++){
      for(let i=this._X0;i<=this._X1;i++){
        let mapExist = false;
        for(let k=this.mapsTiles.length-1;k>=0;k--){
          if(this.mapsTiles[k]._LL==this._LL&&this.mapsTiles[k].i==i&&this.mapsTiles[k].j==j&&this.mapsTiles[k].url===this.urlTemplate.url){
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
          if(this._LL-tmp._LL>0){//zoom in
            let n = this._LL-tmp._LL
            if(tmp.i==Math.floor(i/(2**n))&&tmp.j==Math.floor(j/(2**n))&&tmp.cvs){
              ctx.clearRect(0,0,this.tileWidth,this.tileWidth)
              ctx.drawImage(tmp.cvs,
                Math.abs(this.tileWidth*i/(2**n))%this.tileWidth,Math.abs(this.tileWidth*j/(2**n))%this.tileWidth,
                this.tileWidth/(2**n),this.tileWidth/(2**n),
                0,0,this.tileWidth,this.tileWidth,
              );
            }
            tmp.same=this.mapsTiles[k].url===this.urlTemplate.url
          }else{//zoom out
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
            tmp.same=this.mapsTiles[k].url===this.urlTemplate.url
          }
        }
        let item = {_LL:this._LL,i,j,cvs,_X0:this._X0,_X1:this._X1,_Y0:this._Y0,_Y1:this._Y1,isDrawed:true,url:this.urlTemplate.url};
        this.mapsTiles.push(item);
        this.load(item,this.mapsTiles)
      }
    }
  }
  load(item,tiles){
    setTimeout(()=>{
      if(this._X0<=item.i&&item.i<=this._X1&&this._Y0<=item.j&&item.j<=this._Y1&&item._LL==this._LL){
        let x=item.i%2**item._LL>=0?item.i%2**item._LL:item.i%2**item._LL+2**item._LL;
        let y=item.j%2**item._LL>=0?item.j%2**item._LL:item.j%2**item._LL+2**item._LL;
        let data = this.myTiles.getTile(item._LL,y,x);
        if(data){
          item.cvs = data.cvs;
          item.isDrawed = data.isDrawed;
        }else{
          this.worker.postMessage({z:item._LL,y:y,x:x,j:item.j,i:item.i,url:item.url})
          this.Count++;
          // console.log('加载中',this.Count)
        }
      }else{//删除跳过的瓦片
        for(let k=0;k<tiles.length;k++){
          if(tiles[k]._LL==item._LL&&tiles[k].i==item.i&&tiles[k].j==item.j){
            console.log('地图跳过')
            tiles.splice(k,1);
          }
        }
      }
    },0)
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