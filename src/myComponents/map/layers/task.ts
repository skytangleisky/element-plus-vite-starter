// import Worker from './worker.js?worker'
import url from './worker.js?url'
import { eventbus } from '~/eventbus'
export default class Task{
  workers:Array<{
    busy:boolean
    worker: Worker
  }>
  queue:Array<any>
  constructor(poolSize:number=1){
    this.queue = []
    this.workers = []
    for(let i=0;i<poolSize;i++){
      let worker = new Worker(url,{type: 'module',name:i.toString()})
      worker.onmessage = event => {
        this.workers.forEach((v,k)=>v.worker===worker&&(v.busy=false))
        this.process()
        eventbus.emit('onmessage',event)
      }
      this.workers.push({
        busy:false,
        worker
      })
    }
    eventbus.emit('systemInfo',{thead:`0/${this.workers.length}`})
  }
  destroy(){
    for(let i=0;i<this.workers.length;i++){
      let item = this.workers.splice(i--,1)[0]
      item.worker.terminate()
    }
    eventbus.emit('systemInfo',{thead:`0/0`})
  }
  addTask(arg:any){
    this.queue.push(arg)
    eventbus.emit('systemInfo',{thead:`${this.workers.length-this.queue.length}/${this.workers.length}`})
    this.process()
  }
  process(){
    this.workers.forEach(item => {
      if(!item.busy&&this.queue.length>0){
        item.busy=true
        item.worker.postMessage(this.queue.shift())
      }
    })
    eventbus.emit('systemInfo',{thead:`${this.workers.length-this.queue.length}/${this.workers.length}`})
  }
}