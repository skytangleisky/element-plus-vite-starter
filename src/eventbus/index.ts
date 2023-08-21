export default class Eventbus{
  map:{
    [key:string]:Array<Function>
  }
  constructor() {
    this.map = {}
  }
  on(key:string, callback:Function){
    const fn = this.map[key] || []
    fn.push(callback)
    this.map[key] = fn
  }
  emit(key:string, ...args: Array<any>){
    this.map[key]?.forEach(fn=>{
      fn.apply(this,args)
    })
  }
  off(key:string, callback:Function|undefined=undefined){
    let item = this.map[key]
    if(callback){
      item?.splice(item.findIndex(fn=>fn===callback),1)
    }else{
      delete this.map[key]
    }
  }
  once(key:string, callback:Function){
    let fn = (...args:Array<any>) => {
      callback.apply(this,args)
      this.off(key,fn)
    }
    this.on(key,fn)
  }
}
export const eventbus = new Eventbus()