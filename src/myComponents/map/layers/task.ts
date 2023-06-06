import Worker from './worker.js?worker'
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
      let worker = new Worker()
      worker.onmessage = event => {
        this.workers.forEach(v=>v.worker===worker&&(v.busy=false))
        this.process()
        eventbus.emit('onmessage',event)
      }
      this.workers.push({
        busy:false,
        worker
      })
    }
  }
  addTask(arg:any){
    this.queue.push(arg)
    this.process()
  }
  process(){
    this.workers.forEach(item => {
      if(!item.busy){
        let arg = this.queue.pop()
        if(arg){
          item.busy=true
          item.worker.postMessage(arg)
        }
      }
    })
  }
}