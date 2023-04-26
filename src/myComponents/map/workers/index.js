self.onmessage = e => {
  var xhr = new XMLHttpRequest()
  xhr.open('GET',e.data.url,true)
  xhr.responseType = 'blob'
  xhr.send()
  xhr.onreadystatechange = function() {
    let res = 'response' in xhr ? xhr.response : xhr.responseText
    if(xhr.readyState === 4 && xhr.status === 200) {
      createImageBitmap(res).then(bitmapData=>{
        // bitmap = bitmapData
        // loadStatus='loaded'
        // test(args,country);
        // if(isDrawed){
        //   postMessage({i:args.i,j:args.j,_LL:args._LL,bitmap:cvs.transferToImageBitmap(),isDrawed,beginTime:args.beginTime,x:args._i,y:args._j});
        // }else{
        //   // postMessage({i:args.i,j:args.j,_LL:args._LL,bitmap:0,isDrawed,beginTime:args.beginTime,x:args._i,y:args._j});
        // }
        // delete cvs;
        self.postMessage({z:e.data.z,y:e.data.y,x:e.data.x,i:e.data.i,j:e.data.j,bitmap:bitmapData,isDrawed:true})
      })
    }
  }
  // self.close()
}
self.onerror = e => {
  throw e
}