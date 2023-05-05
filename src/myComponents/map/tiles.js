import { tileXY2QuadKey,quadKey2TileXY } from './js/core.js';
/**
 * 缓存访问过的瓦片地图，没有限制缓存数量，可能导致内存溢出。
 * 图片数量过多，遍历效率会下降。
 */
class Tiles{
  constructor(){
    this.tiles={}
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
    if(!this.tiles[z]){
      this.tiles[z] = {}
    }
    if(!this.tiles[z][y]){
      this.tiles[z][y] = {}
    }
    this.tiles[z][y][x] = data
  }
  delTile(z,y,x){
    delete this.tiles.z?.y?.x
  }
  getTile(z,y,x){
    if(!this.tiles[z]){
      return null
    }
    if(!this.tiles[z][y]){
      return null
    }
    return this.tiles[z][y][x]
  }
  clear(){
    this.tiles={};
  }
}

export default Tiles;