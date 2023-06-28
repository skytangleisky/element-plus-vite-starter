// import Worker from './worker.js?worker'
import url from './worker.js?url'
import { eventbus } from '~/eventbus'
class Task{
  workers:Array<{
    busy:boolean
    worker: Worker
  }>
  queue:Array<any>
  constructor(poolSize:number=1){
    this.queue = []
    this.workers = []
    for(let i=0;i<poolSize;i++){
      let worker = new Worker(url,{type: 'module',name:(i+1).toString()})
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
        let arg = this.queue.shift()
        if(arg){
          item.busy=true
          item.worker.postMessage(arg)
        }
      }
    })
  }
}
const task = new Task(10)
export {
  task
}