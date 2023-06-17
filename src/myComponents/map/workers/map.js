import { tileXY2QuadKey } from '../js/core.js'
self.onmessage = e => {
  let item = Object.assign({},e.data)
  var xhr = new XMLHttpRequest()
  let src = item.url.replaceAll('{x}',item.x).replaceAll('{y}',item.y).replaceAll('{z}',item.z).replace('{q}',tileXY2QuadKey(item.z,item.y,item.x))+(item.url.indexOf('?')==-1?'?t=':'&t=')+Date.now();//?t=xxx防止浏览器本身的缓存机制
  xhr.open('GET',src,true)
  xhr.responseType = 'blob'
  // xhr.timeout=10000
  xhr.onreadystatechange = function() {
    if(xhr.readyState===4){
      let res = 'response' in xhr ? xhr.response : xhr.responseText
      if(xhr.status === 200) {
        createImageBitmap(res).then(bitmapData=>{
          self.postMessage({url:item.url,z:item.z,y:item.y,x:item.x,i:item.i,j:item.j,bitmap:bitmapData,isDrawed:true})
        }).catch(err=>{
          console.error(err)
          self.postMessage({url:item.url,z:item.z,y:item.y,x:item.x,i:item.i,j:item.j,bitmap:-1,isDrawed:false})
        })
      }else{
        self.postMessage({url:item.url,z:item.z,y:item.y,x:item.x,i:item.i,j:item.j,bitmap:-1,isDrawed:false})
        console.error(xhr.status)
      }
    }
  }
  xhr.onerror = function(error){
  }
  xhr.ontimeout = function(){
    self.postMessage({url:item.url,z:item.z,y:item.y,x:item.x,i:item.i,j:item.j,bitmap:-1,isDrawed:false})
  }
  xhr.send()
  // self.close()
}
self.onerror = e => {
  throw e
}