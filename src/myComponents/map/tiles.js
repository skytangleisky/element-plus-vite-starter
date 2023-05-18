import { tileXY2QuadKey,quadKey2TileXY } from './js/core.js';
/**
 * 缓存访问过的瓦片地图，没有限制缓存数量，可能导致内存溢出。
 * 图片数量过多，遍历效率会下降。
 */
class Tiles{
  constructor(){
    this.tiles={}
    this.count=0
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
    Object.getOwnPropertyNames(map).length
    if(this.tiles.hasOwnProperty(z)&&this.tiles[z].hasOwnProperty(y)&&this.tiles[z][y].hasOwnProperty(x)){
      delete this.tiles[z][y][x]
    }
    if(this.tiles.hasOwnProperty(z)&&this.tiles[z].hasOwnProperty(y)&&Object.getOwnPropertyNames(this.tiles[z][y]).length===0){
      delete this.tiles[z][y]
    }
    if(this.tiles.hasOwnProperty(z)&&Object.getOwnPropertyNames(this.tiles[z]).length===0){
      delete this.tiles[z]
    }
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