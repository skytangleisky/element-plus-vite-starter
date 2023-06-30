import BorderWorker from "./borderWorker";
import RadarWorker from "./radarWorker";
import RouteWorker from "./routeWorker";
let borderWorker = new BorderWorker()
let radarWorker = new RadarWorker()
let routeWorker = new RouteWorker()
self.onmessage = function(evt){
  if(evt.data.flag=='BorderLayer'){
    borderWorker.onmessage(evt)
  }else if(evt.data.flag=='RadarLayer'){
    radarWorker.onmessage(evt)
  }else if(evt.data.flag=='RouteLayer'){
    routeWorker.onmessage(evt)
  }
}