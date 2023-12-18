const modules = import.meta.glob('~/**/*.vue')
/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}
export const array2components = array => {
  const arr = deepClone(array)
  arr.map((v,k)=>{
    v.path='/'+v.path
  })
  const fn = l => {
    l.map(v => {
      if(v.children instanceof Array){
        fn(v.children)
      }
      v.component = modules[v.component]
    })
  }
  fn(arr)
  return arr
}
Date.prototype.Format = function(format){
  let that = this;
  if(format==undefined) format = "yyyy-MM-dd HH:mm:ss";
  return format.replace(/yyyy|MM|dd|HH|mm|ss|SSS|S/g, function(a){
    switch(a){
      case 'yyyy':
        return function(i){return (i < 10 ? '0' : '') + i}(that.getFullYear());
      case 'MM':
        return function(i){return (i < 10 ? '0' : '') + i}(that.getMonth() + 1);
      case 'dd':
        return function(i){return (i < 10 ? '0' : '') + i}(that.getDate());
      case 'HH':
        return function(i){return (i < 10 ? '0' : '') + i}(that.getHours());
      case 'mm':
        return function(i){return (i < 10 ? '0' : '') + i}(that.getMinutes());
      case 'ss':
        return function(i){return (i < 10 ? '0' : '') + i}(that.getSeconds());
      case 'S':
        return function(i){return i}(Math.floor(that.getMilliseconds()*10/1000));
      case 'SSS':
        return function(i){return (i < 10 ? '00' : i<100 ? '0' : '') + i}(that.getMilliseconds());
      case 'q':
        return Math.floor((that.getMonth() + 3) / 3)+'';
    }
  });
};
export const RGBtoHSB = (r, g, b) => {
  r /= 255;
  g /= 255;
  b /= 255;
  const v = Math.max(r, g, b),
    n = v - Math.min(r, g, b);
  const h =
    n === 0
      ? 0
      : n && v === r
      ? (g - b) / n
      : v === g
      ? 2 + (b - r) / n
      : 4 + (r - g) / n;
  return [
    Math.round(60 * (h < 0 ? h + 6 : h)),
    Math.round(v && (n / v) * 100),
    Math.round(v * 100),
  ];
};
export const HSBtoRGB = (h, s, b) => {
  s /= 100;
  b /= 100;
  const k = (n) => (n + h / 60) % 6;
  const f = (n) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
  return [Math.round(255 * f(5)), Math.round(255 * f(3)), Math.round(255 * f(1))];
};
export const RGBtoHSL = (r, g, b) => {
  r /= 255, g /= 255, b /= 255;
  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;
  if(max == min){
      h = s = 0; // achromatic
  }else{
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch(max){
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
  }
  return [Math.floor(h*100), Math.round(s*100), Math.round(l*100)];
}
export const HSLtoRGB = (h, s, l) => {
  var r, g, b;
  if (s == 0) {
      r = g = b = l; // achromatic
  } else {
      var hue2rgb = (p, q, t) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1 / 6) return p + (q - p) * 6 * t;
          if (t < 1 / 2) return q;
          if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
          return p;
      }
      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
export class View{
  constructor(arrayBuffer){
    this.dataView = new DataView(arrayBuffer)
    const buffer = new ArrayBuffer(2);
    const dataView = new DataView(buffer);
    dataView.setInt16(0, 256, true);
    const array = new Int16Array(buffer)
    this.littleEndian =  array[0] === 256;
    this.pos=0;
  }
  getOne(){
    let prePos = this.pos
    this.flag = false
    for(let i=0;i<this.dataView.byteLength-prePos;i++){
      if(/\s/g.test(String.fromCharCode(this.getUint8()))){
        if(this.flag){
          this.flag = false
          break;
        }
      }else{
        this.flag = true
        if(i==this.dataView.byteLength - prePos - 1){
          this.flag = false
          this.pos+=1
          break;
        }
      }
    }
    let len = this.pos - prePos - 1
    this.pos = prePos
    return this.getBytes(len)
  }
  getLine(){
    let prePos = this.pos;
    for(let i=0;i<this.dataView.byteLength-prePos;i++){
      let char = String.fromCharCode(this.getUint8())
      if(char=='\r'){
        if(String.fromCharCode(this.getUint8())=='\n'){// end with '\r\n'
          break;
        }else{//end with '\r'
          break;
        }
      }else if(char=='\n'){//end with '\n'
        break;
      }
    }
    let len = this.pos - prePos
    this.pos = prePos
    return this.getBytes(len)
  }
  getInt8(){
    let val = this.dataView.getInt8(this.pos,this.littleEndian)
    this.pos += 1
    return val
  }
  getUint8(){
    let val = this.dataView.getUint8(this.pos,this.littleEndian)
    this.pos += 1
    return val
  }
  getInt16(){
    let val = this.dataView.getInt16(this.pos,this.littleEndian)
    this.pos += 2
    return val
  }
  getUint16(){
    let val = this.dataView.getUint16(this.pos,this.littleEndian)
    this.pos += 2
    return val
  }
  getInt32(){
    let val = this.dataView.getInt32(this.pos,this.littleEndian)
    this.pos += 4
    return val
  }
  getUint32(){
    let val = this.dataView.getUint32(this.pos,this.littleEndian)
    this.pos += 4
    return val
  }
  getBigInt64(){
    let val = this.dataView.getBigInt64(this.pos,this.littleEndian)
    this.pos += 8
    return val
  }
  getBigUint64(){
    let val = this.dataView.getBigUint64(this.pos,this.littleEndian)
    this.pos += 8
    return val
  }
  getFloat32(){
    let val = this.dataView.getFloat32(this.pos,this.littleEndian)
    this.pos += 8
    return val
  }
  getFloat64(){
    let val = this.dataView.getFloat64(this.pos,this.littleEndian)
    this.pos += 8
    return val
  }
  getBytes(len){
    let arr = new Uint8Array(len)
    for(let i=0;i<len;i++){
      arr[i] = this.dataView.getUint8(this.pos,this.littleEndian)
      this.pos++
    }
    return arr
  }
  seek(pos){
    this.pos = pos
  }
  getPos(){
    return this.pos
  }
}
let cvs = document.createElement('canvas')
let ctx = cvs.getContext('2d')
export function loadImage(url,width,height,options){
  return new Promise((resolve,reject)=>{
    let image = new Image();
    image.onload = function(){
      if(options){
        ctx.save()
        cvs.width = image.width
        cvs.height = image.height
        ctx.clearRect(0,0,cvs.width,cvs.height)
        ctx.drawImage(image,0,0)
        let result = {}
        for(let k in options){
          let v = options[k]
          let x = v.x1*cvs.width
          let y = v.y1*cvs.height
          let w = (v.x2-v.x1)*cvs.width
          let h = (v.y2-v.y1)*cvs.height
          if(v.fill){
            let preGlobalCompositeOperation = ctx.globalCompositeOperation
            ctx.globalCompositeOperation = 'source-in'
            ctx.fillStyle = v.fill
            ctx.fillRect(0,0,width,height)
            ctx.globalCompositeOperation = preGlobalCompositeOperation
          }
          let imageData = ctx.getImageData(x,y,w,h)
          result[k] = imageData
        }
        ctx.restore()
        resolve(result)
      }else{
        resolve(image);
      }
    }
    image.onerror = function(err){
      reject(err);
    }
    image.onabort = function(err){
      reject(err);
    }
    image.crossOrigin = 'anonymous';
    width&&(image.width=width)
    height&&(image.height=height)
    image.src=url;
  });
}

export const getColor = v => {
  return v <= 0
    ? "#0000ff"
    : v <= 4
    ? "#002aff"
    : v <= 8
    ? "#0054ff"
    : v <= 12
    ? "#007eff"
    : v <= 16
    ? "#00a8ff"
    : v <= 20
    ? "#00d2ff"
    : v <= 24
    ? "#14d474"
    : v <= 28
    ? "#a6dd00"
    : v <= 32
    ? "#ffe600"
    : v <= 36
    ? "#ffb300"
    : v <= 40
    ? "#ff8000"
    : v <= 44
    ? "#ff4d00"
    : v <= 48
    ? "#ff1a00"
    : v <= 52
    ? "#e60000"
    : v <= 56
    ? "#b30000"
    : v <= 58
    ? "#b30000"
    : "#b30000";
};
export const getFeather = v =>
  v <= 0
    ? 0
    : v <= 1
    ? 1
    : v <= 2
    ? 2
    : v <= 4
    ? 4
    : v <= 6
    ? 6
    : v <= 8
    ? 8
    : v <= 10
    ? 10
    : v <= 12
    ? 12
    : v <= 14
    ? 14
    : v <= 16
    ? 16
    : v <= 18
    ? 18
    : v <= 20
    ? 20
    : v <= 22
    ? 22
    : v <= 24
    ? 24
    : v <= 26
    ? 26
    : v <= 28
    ? 28
    : v <= 30
    ? 30
    : v <= 32
    ? 32
    : v <= 34
    ? 34
    : v <= 36
    ? 36
    : v <= 38
    ? 38
    : v <= 40
    ? 40
    : v <= 42
    ? 42
    : v <= 44
    ? 44
    : v <= 46
    ? 46
    : v <= 48
    ? 48
    : v <= 50
    ? 50
    : v <= 52
    ? 52
    : v <= 54
    ? 54
    : v <= 56
    ? 56
    : v <= 58
    ? 58
    : 60;
export const getCoord = (i, j, v) => ({
  x1: (i * (16 + 20)) / (16 * 10 + 20 * (10 - 1)),
  y1: (j * (32 + 20)) / (32 * 4 + 20 * (4 - 1)),
  x2: (i * (16 + 20)) / (16 * 10 + 20 * (10 - 1)) + 16 / (16 * 10 + 20 * (10 - 1)),
  y2: (j * (32 + 20)) / (32 * 4 + 20 * (4 - 1)) + 32 / (32 * 4 + 20 * (4 - 1)),
  fill: getColor(v),
});