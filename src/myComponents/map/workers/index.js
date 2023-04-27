self.onmessage = e => {
  var xhr = new XMLHttpRequest()
  xhr.open('GET',e.data.url,true)
  xhr.responseType = 'blob'
  xhr.send()
  xhr.onreadystatechange = function() {
    let res = 'response' in xhr ? xhr.response : xhr.responseText
    if(xhr.readyState === 4 && xhr.status === 200) {
      createImageBitmap(res).then(bitmapData=>{
        self.postMessage({z:e.data.z,y:e.data.y,x:e.data.x,i:e.data.i,j:e.data.j,bitmap:bitmapData,isDrawed:true})
      })
    }else if(xhr.readyState === 4 && (xhr.status === 404||xhr.status === 500)){
      self.postMessage({z:e.data.z,y:e.data.y,x:e.data.x,i:e.data.i,j:e.data.j,bitmap:0,isDrawed:false})
    }
  }
  xhr.onerror = function(e){
  }
  // self.close()
}
self.onerror = e => {
  throw e
}