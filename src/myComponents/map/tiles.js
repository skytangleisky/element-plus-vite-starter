import { tileXY2QuadKey,quadKey2TileXY } from './js/core.js';
/**
 * 缓存访问过的瓦片地图，没有限制缓存数量，可能导致内存溢出。
 * 图片数量过多，遍历效率会下降。
 */
class Tiles{
  constructor(){
    this.tiles=new Map()
    // this.tiles={
    //   0:{
    //     0:{
    //       0:cvs,
    //       ...
    //     },
    //     ...
    //   },
    //   ...
    // }
  }
  addTile(z,y,x,data){
    if(!this.tiles.get(z)){
      this.tiles.set(z,new Map())
    }
    if(!this.tiles.get(z).get(y)){
      this.tiles.get(z).set(y,new Map())
    }
    this.tiles.get(z).get(y).set(x,data)
  }
  getTile(z,y,x){
    if(!this.tiles.get(z)){
      return null
    }
    if(!this.tiles.get(z).get(y)){
      return null
    }
    return this.tiles.get(z).get(y).get(x)
  }
  clear(){
    delete this.tiles
    this.tiles=new Map();
  }
}

export default Tiles;