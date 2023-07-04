import Tiles from '../tiles.js'
import BaseLayer from './baseLayer.js'
// import Worker from '../workers/route.js?worker'
import { eventbus } from '~/eventbus'
import { wgs84togcj02 } from '../workers/mapUtil.js'
export default class RouteLayer extends BaseLayer{
  constructor(task){
    super()
    this.mapsTiles = []
    this.平滑 = true
    this.myTiles = new Tiles()
    this.跳过 = 0
    this.effect = false
    this.瓦片网格 = false
    this.isHide = false
    this.tileWidth = 256
    this.task = task
    this.onmessage = (event)=>{
      if(event.data.flag=='RouteLayer'){
        // console.log(((performance.now()-event.data.beginTime)/1000).toFixed(2)+'s');
        for(let k=0;k<this.mapsTiles.length;k++){
          if(this.mapsTiles[k]._LL==event.data._LL&&this.mapsTiles[k].i==event.data.i&&this.mapsTiles[k].j==event.data.j){
            if(event.data.isDrawed&&event.data.bitmap){
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
      }
    }
    eventbus.on('onmessage',this.onmessage)
    this.loadStatus = 'unload'
    this.queue = []
    this.MinLng=+180;
    this.MaxLng=-180;
    this.MinLat=+90;
    this.MaxLat=-90;
    this.maxLineWidth=0;
  }
  off(){
    eventbus.off('onmessage',this.onmessage)
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
    // setTimeout(()=>{//有错误
      if(this._X0<=item.i&&item.i<=this._X1&&this._Y0<=item.j&&item.j<=this._Y1&&item._LL==this._LL){
        let args = {args:{beginTime:performance.now(),i:item.i,j:item.j,_LL:item._LL,_X0:item._X0,_Y0:item._Y0,_X1:item._X1,_Y1:item._Y1},imgX:obj.imgX,imgY:obj.imgY,imgScale:2**obj.L,TileWidth:this.tileWidth,flag:'RouteLayer'}
        if(this.loadStatus=='loaded'){
          this.test(args)
        }else if(this.loadStatus=='loading'){
          this.queue.push(args)
        }else if(this.loadStatus=='unload'){
          this.loadStatus = 'loading'
          console.log('loading')
          var xhr = new XMLHttpRequest()
          xhr.open('GET','http://data.tanglei.top/航路.json',true)
          xhr.responseType = 'json'
          xhr.send()
          xhr.onreadystatechange = () => {
            let res = 'response' in xhr ? xhr.response : xhr.responseText
            if(xhr.readyState === 4 && xhr.status === 200) {
              this.航线 = res
              this.loadStatus = 'loaded'
              for(let i=0;i<this.航线.length;i++){
                this.航线[i].color = '#'+Math.random().toString(16).substring(2, 8).toUpperCase()+'88';
                // this.航线[i].color = '#00ffff44';
              }
              for(let i=0;i<this.航线.length;i++){
                let line = this.航线[i].points.split(" ");if(line.length<2)continue;
                let widths = this.航线[i].widths.split(" ");if(widths.length<2)continue;
                let heights = this.航线[i].safeheis.split(" ");if(heights.length<2)continue;
                let minLng=+180;
                let maxLng=-180;
                let minLat=+90;
                let maxLat=-90;
                line = line.map(function (v) {
                  let lng = v.substring(0,v.indexOf('E'));
                  let lat = v.substring(v.indexOf('E')+1,v.indexOf('N'));
                  let pt = {lng:Number(lng.substring(0,3))+Number(lng.substring(3,5))/60+Number(lng.substring(5,9))/100/3600,lat:Number(lat.substring(0,2))+Number(lat.substring(2,4))/60+Number(lat.substring(4,8))/100/3600}
                  let tmp = wgs84togcj02(Number(lng.substring(0,3))+Number(lng.substring(3,5))/60+Number(lng.substring(5,9))/100/3600,Number(lat.substring(0,2))+Number(lat.substring(2,4))/60+Number(lat.substring(4,8))/100/3600);
                  pt = {lng:tmp[0],lat:tmp[1]};
                  minLng=pt.lng<minLng?pt.lng:minLng;
                  maxLng=pt.lng>maxLng?pt.lng:maxLng;
                  minLat=pt.lat<minLat?pt.lat:minLat;
                  maxLat=pt.lat>maxLat?pt.lat:maxLat;
                  return pt;
                })
                this.航线[i].points = line;
                this.航线[i].widths = widths;
                this.航线[i].heights = heights;
                this.航线[i].minLng=minLng;
                this.航线[i].maxLng=maxLng;
                this.航线[i].minLat=minLat;
                this.航线[i].maxLat=maxLat;
                this.MinLng=minLng<this.MinLng?minLng:this.MinLng;
                this.MaxLng=maxLng>this.MaxLng?maxLng:this.MaxLng;
                this.MinLat=minLat<this.MinLat?minLat:this.MinLat;
                this.MaxLat=maxLat>this.MaxLat?maxLat:this.MaxLat;
                widths.map(v=>{
                  this.maxLineWidth = Number(v)>this.maxLineWidth ? Number(v) : this.maxLineWidth;
                })
              }
              let encoder = new TextEncoder()
              this.uint8Array = encoder.encode(JSON.stringify(this.航线))
              console.log((this.uint8Array.length/1024/1024).toFixed(2)+'MB')
              this.test(args)
              for(let i=0;i<this.queue.length;i++){
                let args = this.queue.splice(i--,1)[0]
                this.test(args)
              }
            }
          }
        }
      }else{//删除跳过的瓦片
        for(let k=0;k<tiles.length;k++){
          if(tiles[k]._LL==item._LL&&tiles[k].i==item.i&&tiles[k].j==item.j){
            console.log('航线跳过')
            tiles.splice(k,100);
          }
        }
      }
    // },0)
  }
  test(args){
    args.MinLng = this.MinLng
    args.MaxLng = this.MaxLng
    args.MinLat = this.MinLat
    args.MaxLat = this.MaxLat
    args.maxLineWidth = this.maxLineWidth
    args.uint8Array = this.uint8Array
    this.task.addTask(args)
  }
}