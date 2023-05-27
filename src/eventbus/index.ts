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
  off(key:string, callback:Function){
    let item = this.map[key]
    item?.splice(item.findIndex(fn=>fn===callback),1)
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