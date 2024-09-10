import * as turf from '@turf/turf'
const modules = import.meta.glob('~/**/*.vue')
import {v4 as uuid} from 'uuid'
import imageUrl from "~/assets/feather.svg?url";
import arrowUrl from "~/assets/arrow.svg?url";
import planeUrl from "~/assets/plane.svg?url";
import projectileUrl from "~/assets/projectile.svg?url";
import droneUrl from "~/assets/aircraft.svg?url";
import { useUserStore } from '~/stores/user';
import { useSettingStore } from '~/stores/setting';
export function hasPermission(permissions:Array<String>){
  const setting = useSettingStore()
  let recurse = (list:any)=>{
    for(let item of list){
      if(Array.isArray(item.children)){
        return recurse(item.children)
      }else{
        if(permissions.indexOf(item.name)>=0&&item.checked){
          return true
        }
      }
    }
  }
  return recurse(setting.permissions)
}
export function checkPermission(roles:string[]) {
  const user = useUserStore()
  if(user.roles.includes('admin')){
    return true;
  }else return intersection(user.roles,roles)
}
export const area = (vertices: Array<[number, number]>) => {
  let area = 0;
  for (let i = 0; i < vertices.length; i++) {
    let current = vertices[i];
    let next = vertices[(i + 1) % vertices.length];
    area +=  current[0] * next[1] - next[0] * current[1];
  }
  return area / 2;
}
export const pointInPolygon = (point: [number, number], polygon: Array<[number, number]>) => {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    let xi = polygon[i][0],
      yi = polygon[i][1];
    let xj = polygon[j][0],
      yj = polygon[j][1];
    let intersect =
      yi > point[1] != yj > point[1] &&
      point[0] < ((xj - xi) * (point[1] - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function deepClone<T>(obj: T): T {
  // Check for null or undefined values
  if (obj === null || obj === undefined) {
    return obj;
  }

  // Handle Date objects
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }

  // Handle Array objects
  if (Array.isArray(obj)) {
    const arrCopy = [] as any[];
    for (const item of obj) {
      arrCopy.push(deepClone(item));
    }
    return arrCopy as any;
  }

  // Handle Object literals
  if (typeof obj === 'object') {
    const objCopy = {} as { [key: string]: any };
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        objCopy[key] = deepClone((obj as { [key: string]: any })[key]);
      }
    }
    return objCopy as T;
  }

  // Return the value if obj is not an object or array
  return obj;
}
export function intersection<T>(arr1: T[], arr2: T[]): boolean {
  return arr2.some(item => arr1.includes(item));
}
export const array2components = (array:Array<{[key:string]:any}>, roles:Array<string>) => {
  const arr = deepClone(array)
  arr.map((v,k)=>{
    v.path='/' + v.path
    v.identify = uuid()
  })
  const fn = (list:Array<any>) => {
    for(let i=0;i<list.length;i++){
      let v = list[i]
      if(!v.meta || !v.meta.roles || intersection(roles,v.meta.roles)){
        if(v.children instanceof Array){
          fn(v.children)
        }
        v.component = modules[v.component]
      }else{
        list.splice(i--,1)
      }
    }
  }
  fn(arr)
  return arr
}
// export const array2components = (array:Array<{[key:string]:any}>, roles:Array<string>) => {
//   const arr = deepClone(array)
//   arr.map((v,k)=>{
//     v.path='/' + v.path
//     v.identify = uuid()
//   })
//   const fn = (list:Array<any>) => {
//     for(let i=0;i<list.length;i++){
//       if(list[i].children instanceof Array){
//         fn(list[i].children)
//       }
//       list[i].component = modules[list[i].component]
//     }
//   }
//   fn(arr)
//   return arr
// }
Date.prototype.Format = function(format:any){
  let that = this;
  if(format==undefined) format = "yyyy-MM-dd HH:mm:ss";
  return format.replace(/yyyy|MM|dd|HH|mm|ss|SSS|SS|S/g, function(a:string){
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
export const RGBtoHSB = (r:number, g:number, b:number) => {
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
export const HSBtoRGB = (h:number, s:number, b:number) => {
  s /= 100;
  b /= 100;
  const k = (n:number) => (n + h / 60) % 6;
  const f = (n:number) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
  return [Math.round(255 * f(5)), Math.round(255 * f(3)), Math.round(255 * f(1))];
};
export const RGBtoHSL = (r:number, g:number, b:number) => {
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
        default: h = (r - g) / d + 4; break;
      }
      h /= 6;
  }
  return [Math.floor(h*100), Math.round(s*100), Math.round(l*100)];
}
export const HSLtoRGB = (h:number, s:number, l:number) => {
  var r, g, b;
  if (s == 0) {
      r = g = b = l; // achromatic
  } else {
      var hue2rgb = (p:number, q:number, t:number) => {
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
  dataView:DataView
  flag:boolean
  pos:number
  littleEndian:boolean|undefined
  constructor(arrayBuffer:ArrayBuffer,littleEndian:boolean|undefined=undefined){
    this.dataView = new DataView(arrayBuffer)
    this.pos=0;
    this.flag=false
    this.littleEndian=littleEndian
  }
  getOne(){
    let prePos = this.pos
    this.flag = false
    let tmp = ''
    for(let i=0;i<this.dataView.byteLength-prePos;i++){
      tmp+=String.fromCharCode(this.getUint8())
      if((/\s*\S+\s+\S/g.test(tmp))){
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
    let val = this.dataView.getInt8(this.pos)
    this.pos += 1
    return val
  }
  getUint8(){
    let val = this.dataView.getUint8(this.pos)
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
  getBytes(len:number){
    let arr = []
    for(let i=0;i<len;i++){
      arr.push(this.dataView.getUint8(this.pos))
      this.pos++
    }
    return Uint8Array.from(arr)
  }
  getAll(){
    let arr = []
    while(this.pos<this.dataView.byteLength){
      arr.push(this.dataView.getUint8(this.pos))
      this.pos++
    }
    return Uint8Array.from(arr)
  }
  seek(pos:number){
    this.pos = pos
  }
  getPos(){
    return this.pos
  }
  reachEnd(){
    return this.pos == this.dataView.byteLength
  }
}
let cvs = document.createElement('canvas')
let ctx = cvs.getContext('2d') as unknown as CanvasRenderingContext2D
export function loadImage(url:string,width:number,height:number,options:any){
  return new Promise((resolve,reject)=>{
    let image = new Image();
    image.onload = function(){
      if(options){
        cvs.width = image.width
        cvs.height = image.height
        ctx.clearRect(0,0,cvs.width,cvs.height)
        ctx.drawImage(image,0,0,image.width,image.height,0,0,cvs.width,cvs.height)
        let result:{[key:string]:any} = {}
        for(let k in options){
          let v = options[k]
          let x = Math.round(v.x1*cvs.width)
          let y = Math.round(v.y1*cvs.height)
          let w = Math.round((v.x2-v.x1)*cvs.width)
          let h = Math.round((v.y2-v.y1)*cvs.height)
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
      width&&(image.width=Math.round(width*devicePixelRatio))
      height&&(image.height=Math.round(height*devicePixelRatio))
    }
    image.src=url;
  });
}
export const getHue = (min:number, v:number, max:number) => {
  let value;
  if (v < min) {
    value = min;
  } else if (v > max) {
    value = max;
  } else {
    value = v;
  }
  //hsl(240,100%,50%)～hsl(180,100%,50%)hsl(60,100%,50%)～hsl(0,100%,50%)
  let percent = (value - min) / (max - min);
  return percent < 0.5 ? ((0.5 - percent) / 0.5) * 60 + 180 : ((1 - percent) / 0.5) * 60;
};
export const getColor = (v:number) => {
  let value = getFeather(v)
  if(value==''){
    return ''
  }else{
    return `hsl(${getHue(0,value as number,20)},100%,50%)`
  }
}
export const getFeather = (v:number) =>{
  if(v==null||v==undefined||Math.abs(v)===999||v==0){
    return ''
  }
  return v <= 1
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
}
export const getCoord = (i:number, j:number, v:number) => ({
  x1: (i * (16 + 20)) / 340,
  y1: (j * (32 + 20)) / 188,
  x2: (i * (16 + 20)) / 340 + 16 / 340,
  y2: (j * (32 + 20)) / 188 + 32 / 188,
  fill: getColor(v),
});
export const addFeatherImages = async( map:any ) => {
  let result:{[key:string]:any} = await loadImage(imageUrl, 340, 188, {
    feather: getCoord(3, 3, 0),
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
  }) as unknown as {[key:string]:any};
  for (let k in result) {
    map.addImage(k, result[k]);
  }
  result = await loadImage(droneUrl,32,32,{
    drone:{
      x1: 0,
      y1: 0,
      x2: 1,
      y2: 1,
      fill: 'yellow',
    }
  }) as unknown as {[key:string]:any}
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
  }) as unknown as {[key:string]:any}
  for (let k in result) {
    map.addImage(k, result[k]);
  }
  result = await loadImage(projectileUrl,16,32,{
    'projectile-white':{
      x1: 0,
      y1: 0,
      x2: 1,
      y2: 1,
      // fill: 'white',
    },
    'projectile-red':{
      x1: 0,
      y1: 0,
      x2: 1,
      y2: 1,
      fill: 'red',
    }
  }) as unknown as {[key:string]:any}
  for (let k in result) {
    map.addImage(k, result[k]);
  }
}
export const addArrowImages = async( map:any ) => {
  let result:{[key:string]:any} = await loadImage(arrowUrl, 340, 188, {
    arrow: getCoord(3, 3, 0),
    arrow0: getCoord(0, 0, 0),
    arrow1: getCoord(1, 0, 1),
    arrow2: getCoord(2, 0, 2),
    arrow4: getCoord(3, 0, 3),
    arrow6: getCoord(4, 0, 6),
    arrow8: getCoord(5, 0, 8),
    arrow10: getCoord(6, 0, 10),
    arrow12: getCoord(7, 0, 12),
    arrow14: getCoord(8, 0, 14),
    arrow16: getCoord(9, 0, 16),
    arrow18: getCoord(0, 1, 18),
    arrow20: getCoord(1, 1, 20),
    arrow22: getCoord(2, 1, 22),
    arrow24: getCoord(3, 1, 24),
    arrow26: getCoord(4, 1, 26),
    arrow28: getCoord(5, 1, 28),
    arrow30: getCoord(6, 1, 30),
    arrow32: getCoord(7, 1, 32),
    arrow34: getCoord(8, 1, 34),
    arrow36: getCoord(9, 1, 36),
    arrow38: getCoord(0, 2, 38),
    arrow40: getCoord(1, 2, 40),
    arrow42: getCoord(2, 2, 42),
    arrow44: getCoord(3, 2, 44),
    arrow46: getCoord(4, 2, 46),
    arrow48: getCoord(5, 2, 48),
    arrow50: getCoord(6, 2, 50),
    arrow52: getCoord(7, 2, 52),
    arrow54: getCoord(8, 2, 54),
    arrow56: getCoord(9, 2, 56),
    arrow58: getCoord(0, 3, 58),
    arrow60: getCoord(1, 3, 60),
  }) as unknown as {[key:string]:any};
  for (let k in result) {
    map.addImage(k, result[k]);
  }
}
export const getRandomPointBetweenR1R2 = (r1:number, r2:number) => {
  let min = Math.min(r1, r2);
  let max = Math.max(r1, r2);
  let R = (max - min) * Math.random() + min;
  let Ⳡ = Math.random() * Math.PI * 2;
  let x = R * Math.cos(Ⳡ);
  let y = R * Math.sin(Ⳡ);
  return [x, y];
};
export function calculateSectorPoints(
  center: [number, number],
  radius: number,
  startAngle: number,
  endAngle: number,
  steps: number,
  units: turf.Units
): [number, number][] {
  const points: [number, number][] = [center];
  const angleStep = 360 / steps;
  let angle = startAngle;
  for (; angle < endAngle; angle += angleStep) {
    const point = turf.destination(center, radius, angle, {
      units: units,
    }) as any;
    points.push(point.geometry.coordinates);
  }
  const point = turf.destination(center, radius, endAngle, {
    units: units,
  }) as any;
  points.push(point.geometry.coordinates);
  points.push(center); // 返回到圆心以关闭多边形
  return points;
}
export function calculateCirclePoints(
  center: [number, number],
  radius: number,
  steps: number,
  units: turf.Units
): [number, number][] {
  const points: [number, number][] = [];
  const angleStep = 360 / steps;
  let angle = 0;
  for (; angle < 360; angle += angleStep) {
    const point = turf.destination(center, radius, angle, {
      units: units,
    }) as any;
    points.push(point.geometry.coordinates);
  }
  const point = turf.destination(center, radius, 360, {
    units: units,
  }) as any;
  points.push(point.geometry.coordinates);
  return points;
}
export function calculateBlockPoints(
  center: [number, number],
  radius1: number,
  radius2: number,
  startAngle: number,
  endAngle: number,
  steps: number,
  units: turf.Units
): [number, number][] {
  const points: [number, number][] = [];
  const angleStep = 360 / steps;
  let angle = startAngle;
  for (; angle < endAngle; angle += angleStep) {
    const point1 = turf.destination(center, radius1, angle, {
      units: units,
    }) as any;
    points.push(point1.geometry.coordinates);
  }
  const point1 = turf.destination(center, radius1, endAngle, {
    units: units,
  }) as any;
  points.push(point1.geometry.coordinates);

  angle = endAngle;
  for (; angle > startAngle; angle -= angleStep) {
    const point2 = turf.destination(center, radius2, angle, {
      units: units,
    }) as any;
    points.push(point2.geometry.coordinates);
  }
  const point2 = turf.destination(center, radius2, startAngle, {
    units: units,
  }) as any;
  points.push(point2.geometry.coordinates);

  points.push(points[0]);
  return points;
}
export function sixty2Float(val:number|string){
  if(typeof val == 'number' || typeof val == 'undefined'){
    return val
  }else if(/^\d+(\.\d+)?$/.test(val)){
    return Number(val)
  }else{
    let degree = val.match(/(\d+)?\.\d+(?=°)|\d+(?=°)/g);
    let minute = val.match(/(\d+)?\.\d+(?=′)|\d+(?=′)/g);
    let second = val.match(/(\d+)?\.\d+(?=″)|\d+(?=″)/g);
    if(!(degree&&minute&&second)||degree.length!=1||minute.length!=1||second.length!=1){
      throw "invalid val:" + val;
    }else{
      return Number(degree[0]) + Number(minute[0])/60 + Number(second[0])/3600
    }
  }
}