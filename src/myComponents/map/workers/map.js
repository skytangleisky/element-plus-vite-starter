import { tileXY2QuadKey } from '../js/core.js'
self.onmessage = e => {
  var xhr = new XMLHttpRequest()
  let src = e.data.url.replaceAll('{x}',e.data.x).replaceAll('{y}',e.data.y).replaceAll('{z}',e.data.z).replace('{q}',tileXY2QuadKey(e.data.z,e.data.y,e.data.x))+(e.data.url.indexOf('?')==-1?'?t=':'&t=')+Date.now();//?t=xxx防止浏览器本身的缓存机制
  xhr.open('GET',src,true)
  xhr.responseType = 'blob'
  // xhr.timeout=10000
  xhr.onreadystatechange = function() {
    if(xhr.readyState===4){
      let res = 'response' in xhr ? xhr.response : xhr.responseText
      if(xhr.status === 200) {
          createImageBitmap(res).then(bitmapData=>{
            self.postMessage({url:e.data.url,z:e.data.z,y:e.data.y,x:e.data.x,i:e.data.i,j:e.data.j,bitmap:bitmapData,isDrawed:true})
          }).catch(err=>{
            self.postMessage({url:e.data.url,z:e.data.z,y:e.data.y,x:e.data.x,i:e.data.i,j:e.data.j,bitmap:-1,isDrawed:false})
          })
      }else if(xhr.status === 404||xhr.status === 500){
        self.postMessage({url:e.data.url,z:e.data.z,y:e.data.y,x:e.data.x,i:e.data.i,j:e.data.j,bitmap:0,isDrawed:false})
      }else{
        self.postMessage({url:e.data.url,z:e.data.z,y:e.data.y,x:e.data.x,i:e.data.i,j:e.data.j,bitmap:0,isDrawed:true})
      }
    }
  }
  xhr.onerror = function(error){
  }
  xhr.ontimeout = function(){
    self.postMessage({url:e.data.url,z:e.data.z,y:e.data.y,x:e.data.x,i:e.data.i,j:e.data.j,bitmap:-1,isDrawed:false})
  }
  xhr.send()
  // self.close()
}
self.onerror = e => {
  throw e
}