import { tileXY2QuadKey,quadKey2TileXY } from './js/core.js';
/**
 * 缓存访问过的瓦片地图，没有限制缓存数量，可能导致内存溢出。
 * 图片数量过多，遍历效率会下降。
 */
class Tiles{
  constructor(){
    this.tiles=[]
  }
  addTile(z,y,x,data){
    let quadKey = tileXY2QuadKey(z,y,x);
    this.delTile(z,y,x);
    this.tiles.push({quadKey,data});
  }
  delTile(z,y,x){
    let quadKey = tileXY2QuadKey(z,y,x);
    for(let i=0;i<this.tiles.length;i++){
      if(quadKey==this.tiles[i].quadKey){
        this.tiles.splice(i,1);
        break;
      }
    }
  }
  getTile(z,y,x){
    let quadKey = tileXY2QuadKey(z,y,x);
    for(let i=0;i<this.tiles.length;i++){
      if(quadKey==this.tiles[i].quadKey){
        return this.tiles[i].data;
      }
    }
    return null;
  }
  clear(){
    this.tiles=[];
  }
}

export default Tiles;