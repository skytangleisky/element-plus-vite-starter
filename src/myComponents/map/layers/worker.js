import BorderWorker from "./borderWorker";
import RadarWorker from "./radarWorker";
let borderWorker = new BorderWorker()
let radarWorker = new RadarWorker()
self.onmessage = function(evt){
  if(evt.data.flag=='BorderLayer'){
    borderWorker.onmessage(evt)
  }else if(evt.data.flag=='RadarLayer'){
    radarWorker.onmessage(evt)
  }
}