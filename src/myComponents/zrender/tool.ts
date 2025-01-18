//限制帧率
export class Restrictor {
  then:number;
  interval:number;
  constructor(interval:number=0) {
    this.then = 0;
    this.interval = interval;
  }
  process(timestamp:number,callback:Function){
    if(timestamp - this.then > this.interval){
      this.interval > 0 && (this.then = timestamp - ((timestamp - this.then) % this.interval))
      callback()
    }
  }
}
//计算帧率
export class FPSTool{
  lastTime:number;
  frames:number;
  measureTime:number;
  constructor(measueTime:number=1000) {
    this.lastTime = 0;
    this.frames = 0;
    this.measureTime = measueTime;
  }
  measure(timestamp:number,callback:Function){
    this.frames++
    if(timestamp - this.lastTime >= this.measureTime){
      const fps = Math.round((this.frames * 1000) / (timestamp - this.lastTime)*100)/100
      callback(fps)
      this.frames = 0;
      this.lastTime = timestamp;
    }
  }
}