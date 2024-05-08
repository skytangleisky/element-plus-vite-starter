const EARTH_RADIUS = 6371008.8
export function getDistance( lng1, lat1,  lng2, lat2 ){
  // var radLng1 = lng1*Math.PI / 180.0
  // var radLat1 = lat1*Math.PI / 180.0
  // var radLng2 = lng2*Math.PI / 180.0
  // var radLat2 = lat2*Math.PI / 180.0
  // return 2 * Math.asin(Math.sqrt(Math.sin((radLat1-radLat2)/2)**2 + Math.cos(radLat1)*Math.cos(radLat2)*(Math.sin((radLng1-radLng2)/2)**2))) * EARTH_RADIUS
  let xy1 = lngLat2XY(lng1,lat1)
  let xy2 = lngLat2XY(lng2,lat2)
  return Math.sqrt((xy2.x-xy1.x)**2+(xy2.y-xy1.y)**2)
}

export function lngLat2Pixel(lng,lat,imgX,imgY,imgScale,TileWidth){
  return{
    x:lng2Pixel(lng,imgX,imgScale,TileWidth),
    y:lat2Pixel(lat,imgY,imgScale,TileWidth),
  }
}
export function pixel2LngLat(x,y,imgX,imgY,imgScale,TileWidth){
  return{
    lng:pixel2Lng(x,imgX,imgScale,TileWidth),
    lat:pixel2Lat(y,imgY,imgScale,TileWidth),
  }
}
export function lng2Pixel(lng,imgX,imgScale,TileWidth){
  return imgX + TileWidth*imgScale*(lng+180)/360;
}
export function lat2Pixel(lat,imgY,imgScale,TileWidth){
  return imgY + (Math.PI - Math.asinh(Math.tan(lat/180*Math.PI))) / (2 * Math.PI) * TileWidth * imgScale
}
export function pixel2Lng(x,imgX,imgScale,TileWidth){
  return (x-imgX)/imgScale/TileWidth*360.0-180;
}
export function pixel2Lat(y,imgY,imgScale,TileWidth){
  return Math.atan(Math.sinh(Math.PI - (y - imgY)/(TileWidth * imgScale)*(2 * Math.PI)))/Math.PI*180
}
export function lngLat2XY(lng,lat){
  return {
    x: EARTH_RADIUS * lng / 180 * Math.PI,
    y: EARTH_RADIUS * Math.asinh(Math.tan(lat/180*Math.PI)),
  }
}
export function XY2LngLat(x,y){
  return {
    lng: x / EARTH_RADIUS / Math.PI * 180,
    lat: Math.atan(Math.sinh(y/EARTH_RADIUS)) / Math.PI * 180,
  }
}
export function XY2Pixel(x,y,imgX,imgY,imgScale,TileWidth){
  let lngLat = XY2LngLat(x,y)
  return lngLat2Pixel(lngLat.lng,lngLat.lat,imgX,imgY,imgScale,TileWidth)
}
export function pixel2XY(x,y,imgX,imgY,imgScale,TileWidth){
  let {lng,lat} = pixel2LngLat(x,y,imgX,imgY,imgScale,TileWidth)
  return lngLat2XY(lng,lat)
}
export function destinationPoint(lon,lat,deg,distance){
  let {x,y} = lngLat2XY(lon,lat)
  return XY2LngLat(x+Math.sin(deg/180*Math.PI)*distance,y+Math.cos(deg/180*Math.PI)*distance)
}
export function windowToCanvas(x,y,canvas) {
  var box = canvas.getBoundingClientRect()
  return {
    x: (x - box.left)/box.width*canvas.width,
    y: (y - box.top)/box.height*canvas.height,
  }
}
var bezier3func = function(uu,controlP){
  var partX0 = controlP[0].x * uu * uu * uu;
  var partX1 = 3 * controlP[1].x * uu * uu * (1 - uu);
  var partX2 = 3 * controlP[2].x * uu * (1 - uu) * (1 - uu);
  var partX3 = controlP[3].x * (1 - uu) * (1 - uu) * (1 - uu);
  var partY0 = controlP[0].y * uu * uu * uu;
  var partY1 = 3 * controlP[1].y * uu * uu * (1 - uu);
  var partY2 = 3 * controlP[2].y * uu * (1 - uu) * (1 - uu);
  var partY3 = controlP[3].y * (1 - uu) * (1 - uu) * (1 - uu);
  return [partX0 + partX1 + partX2 + partX3, partY0 + partY1 + partY2 + partY3];
}

export function bezierCurve(originPoints,step = 0.005) {
  if(originPoints.length<3)return originPoints;
  let originPoint = [];
  for(let i=0;i<originPoints.length;i++){
      originPoint.push({x:originPoints[i][0],y:originPoints[i][1]});
  }
  let isLoop = JSON.stringify(originPoint[0])==JSON.stringify(originPoint.slice(-1)[0]);
  if(isLoop){//闭合曲线
    let first = originPoint[1];
    let last = originPoint.slice(-2)[0];
    originPoint.unshift(last);
    originPoint.push(first);
  }else{
    let first = originPoint[0];
    let last = originPoint.slice(-1)[0];
    originPoint.unshift(first);
    originPoint.push(last);
  }


  var curvePoint=[];
  var scale = 0.6;
  var midpoints=[];

  for (var i = 0; i < originPoint.length; i++) {//生成中点
      var nexti = (i + 1) % originPoint.length;
      midpoints.push({x:(originPoint[i].x + originPoint[nexti].x) / 2.0,y:(originPoint[i].y + originPoint[nexti].y) / 2.0});
  }

  var extrapoints=[];
  for(var i=0;i<2*originPoint.length;i++){//平移中点
      extrapoints.push({x:0,y:0});
  }
  for (var i = 0; i < originPoint.length; i++) {
      var nexti = (i + 1) % originPoint.length;
      var backi = (i + originPoint.length - 1) % originPoint.length;
      var midinmid={};
      midinmid.x = (midpoints[i].x + midpoints[backi].x) / 2.0;
      midinmid.y = (midpoints[i].y + midpoints[backi].y) / 2.0;
      var offsetx = originPoint[i].x - midinmid.x;
      var offsety = originPoint[i].y - midinmid.y;
      var extraindex = 2 * i;
      extrapoints[extraindex].x = midpoints[backi].x + offsetx;
      extrapoints[extraindex].y = midpoints[backi].y + offsety;
      //朝 originPoint[i]方向收缩
      var addx = (extrapoints[extraindex].x - originPoint[i].x) * scale;
      var addy = (extrapoints[extraindex].y - originPoint[i].y) * scale;
      extrapoints[extraindex].x = originPoint[i].x + addx;
      extrapoints[extraindex].y = originPoint[i].y + addy;

      var extranexti = (extraindex + 1) % (2 * originPoint.length);
      extrapoints[extranexti].x = midpoints[i].x + offsetx;
      extrapoints[extranexti].y = midpoints[i].y + offsety;
      //朝 originPoint[i]方向收缩
      addx = (extrapoints[extranexti].x - originPoint[i].x) * scale;
      addy = (extrapoints[extranexti].y - originPoint[i].y) * scale;
      extrapoints[extranexti].x = originPoint[i].x + addx;
      extrapoints[extranexti].y = originPoint[i].y + addy;

  }

  var controlPoint = [];
  //生成4控制点，产生贝塞尔曲线
  for (let k=1; k < originPoint.length-2; k++) {
      controlPoint[0] = originPoint[k];
      var extraindex = 2 * k;
      controlPoint[1] = extrapoints[extraindex + 1];
      var extranexti = (extraindex + 2) % (2 * originPoint.length);
      controlPoint[2] = extrapoints[extranexti];
      var nexti = (k + 1) % originPoint.length;
      controlPoint[3] = originPoint[nexti];
      var u = 1;
      while (u >= 0) {
          u -= step;
          curvePoint.push(bezier3func(u,controlPoint));
      }
  }
  curvePoint.unshift(originPoints[0]);
  return curvePoint;
}
export function degree2Float(val){
  if(typeof val == 'number' || typeof val == 'undefined'){
      return val
  }else{
      let degree = val.match(/(\d+)?\.\d+(?=°)|\d+(?=°)/g);
      let minute = val.match(/(\d+)?\.\d+(?=')|\d+(?=')/g);
      let second = val.match(/(\d+)?\.\d+(?=")|\d+(?=")/g);
      if(!(degree&&minute&&second)||degree.length!=1||minute.length!=1||second.length!=1){
        return Number(val)
      }else{
      return Number(degree[0]) + Number(minute[0])/60 + Number(second[0]/3600)
      }
  }
}
export function quadKey2TileXY(quadKey){
  let tileX=0;
  let tileY=0;
  let z = quadKey.length;
  for (let i = z; i > 0; i--)
  {
    let mask = 1 << (i - 1);
    switch (quadKey[z - i])
    {
      case '0':
        break;
      case '1':
        tileX |= mask;
        break;
      case '2':
        tileY |= mask;
        break;
      case '3':
        tileX |= mask;
        tileY |= mask;
        break;
      default:
        throw new ArgumentException("Invalid QuadKey digit sequence.");
    }
  }
  return{x:tileX,y:tileY,z};
}
export function tileXY2QuadKey(z,y,x) {
  var quadkey = "";
  for (var i = z; i >= 0; --i) {
    var bitmask = 1 << i;
    var digit = 0;
    if ((x & bitmask) !== 0) {
      digit |= 1;
    }
    if ((y & bitmask) !== 0) {
      digit |= 2;
    }
    quadkey += digit;
  }
  if(quadkey[0] === '0') {
    quadkey = quadkey.substring(1);
  }
  return quadkey;
}
export function rgb2Hsl(r, g, b){
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
  return [Math.floor(h*100), Math.round(s*100)+"%", Math.round(l*100)+"%"];
}
export function hsl2Rgb(h, s, l) {
  var r, g, b;

  if (s == 0) {
      r = g = b = l; // achromatic
  } else {
      var hue2rgb = function hue2rgb(p, q, t) {
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