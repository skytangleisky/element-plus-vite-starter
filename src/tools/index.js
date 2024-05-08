const modules = import.meta.glob('~/**/*.vue')
import imageUrl from "~/assets/feather.svg?url";
import planeUrl from "~/assets/plane.svg?url";
import projectileUrl from "~/assets/projectile.svg?url";
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
  return format.replace(/yyyy|MM|dd|HH|mm|ss|SSS|SS|S/g, function(a){
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
      case 'SS':
        return function(i){return i.toFixed().padStart(2,'0')}(Math.floor(that.getMilliseconds()*100/1000));
      case 'SSS':
        return function(i){return i.toFixed().padStart(3,'0')}(that.getMilliseconds());
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
    this.pos += 4
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
        cvs.width = width * devicePixelRatio
        cvs.height = height * devicePixelRatio
        ctx.clearRect(0,0,cvs.width,cvs.height)
        ctx.drawImage(image,0,0,image.width,image.height,0,0,cvs.width,cvs.height)
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
            ctx.fillRect(0,0,cvs.width,cvs.height)
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
    if(url.endsWith('.svg')){
      width&&(image.width=width)
      height&&(image.height=height)
    }
    image.src=url;
  });
}
export const getHue = (min, v, max) => {
  let value;
  if (v < min) {
    value = min;
  } else if (v > max) {
    value = max;
  } else {
    value = v;
  }
  //hsl(240,100%,50%)～hsl(180,100%,50%)hsl(60,100%,50%)～hsl(0,100%,50%)
  let percent = (v - min) / (max - min);
  return percent < 0.5 ? ((0.5 - percent) / 0.5) * 60 + 180 : ((1 - percent) / 0.5) * 60;
};
export const getColor = v => `hsl(${getHue(0,v,60)},100%,50%)`
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
export const addFeatherImages = async( map ) => {
    let result
    result = await loadImage(imageUrl, 340, 188, {
      feather0: getCoord(0, 0, 0),
      feather1: getCoord(1, 0, 1),
      feather2: getCoord(2, 0, 2),
      feather4: getCoord(3, 0, 3),
      feather6: getCoord(4, 0, 6),
      feather8: getCoord(5, 0, 8),
      feather10: getCoord(6, 0, 10),
      feather12: getCoord(7, 0, 12),
      feather14: getCoord(8, 0, 14),
      feather16: getCoord(9, 0, 16),
      feather18: getCoord(0, 1, 18),
      feather20: getCoord(1, 1, 20),
      feather22: getCoord(2, 1, 22),
      feather24: getCoord(3, 1, 24),
      feather26: getCoord(4, 1, 26),
      feather28: getCoord(5, 1, 28),
      feather30: getCoord(6, 1, 30),
      feather32: getCoord(7, 1, 32),
      feather34: getCoord(8, 1, 34),
      feather36: getCoord(9, 1, 36),
      feather38: getCoord(0, 2, 38),
      feather40: getCoord(1, 2, 40),
      feather42: getCoord(2, 2, 42),
      feather44: getCoord(3, 2, 44),
      feather46: getCoord(4, 2, 46),
      feather48: getCoord(5, 2, 48),
      feather50: getCoord(6, 2, 50),
      feather52: getCoord(7, 2, 52),
      feather54: getCoord(8, 2, 54),
      feather56: getCoord(9, 2, 56),
      feather58: getCoord(0, 3, 58),
      feather60: getCoord(1, 3, 60),
    });
    for (let k in result) {
      map.addImage(k, result[k]);
    }
    result = await loadImage(planeUrl,32,32,{
      airplane:{
        x1: 0,
        y1: 0,
        x2: 1,
        y2: 1,
        fill: 'yellow',
      }
    })
    for (let k in result) {
      map.addImage(k, result[k]);
    }
    result = await loadImage(projectileUrl,32,32,{
      projectile:{
        x1: 0,
        y1: 0,
        x2: 1,
        y2: 1,
        fill: 'red',
      }
    })
    for (let k in result) {
      map.addImage(k, result[k]);
    }
}
export const getRandomPointBetweenR1R2 = (r1, r2) => {
  let min = Math.min(r1, r2);
  let max = Math.max(r1, r2);
  let R = (max - min) * Math.random() + min;
  let Ⳡ = Math.random() * Math.PI * 2;
  let x = R * Math.cos(Ⳡ);
  let y = R * Math.sin(Ⳡ);
  return [x, y];
};