
class Controller{
  private list:Array<Function> = new Array<Function>()
  aborted:boolean = false;
  append(func:Function){
    this.list.push(func)
  }
  remove(func:Function){
    for(let i=0;i<this.list.length;i++){
      if(this.list[i]==func){
        this.list.splice(i--,1)
      }
    }
  }
  abort(){
    this.aborted = true;
    while(this.list.length){
      this.list.shift()?.()
    }
  }
}
export default class Sleeper{
  private controller:Controller = new Controller();
  public sleep = (ms:number) => new Promise((resolve, reject) => {
    const func = ()=>{
      clearTimeout(timer);
      reject('在等待的promise中abort');
    }
    const timer = setTimeout(() => {
      if(this.controller.aborted){
        clearTimeout(timer);
        reject('已经aborted');
      }else{
        this.controller.remove(func)
        resolve('Operation completed');
      }
    }, ms);
    if(!this.controller.aborted){
      this.controller.append(func)
    }
  });
  public abort(){
    this.controller.abort()
  }
}

