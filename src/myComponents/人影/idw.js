export function calculateDistance( pt, point ){
  var radLat1 = pt.lat*Math.PI / 180.0;
  var radLat2 = point.lat*Math.PI / 180.0;
  var a = radLat1 - radLat2;
  var b = pt.lng*Math.PI / 180.0 - point.lng*Math.PI / 180.0;
  var s = 2 * Math.asin(Math.sqrt(Math.sin(a/2)**2 + Math.cos(radLat1)*Math.cos(radLat2)*Math.sin(b/2)**2));
  s = s * 6371008.8;
  return s;
}
function idwInterpolation(pt, points, power) {
  let numerator = 0;
  let denominator = 0;
  points.forEach(point => {
      const distance = calculateDistance(pt, point);
      const weight = 1 / Math.pow(distance, power);
      numerator += weight * point.value;
      denominator += weight;
  });
  return numerator / denominator;
}
export default function interpolate(data, options){
  options = Object.assign({sizeU:10,sizeV:10,boundary:{lng:0,lat:0,width:30,height:40},power:2},options)
  let grid = []
  for(let j=0;j<options.sizeV;j++){
    let row = []
    for(let i=0;i<options.sizeU;i++){
      let pt = {
        lng:options.boundary.lng+i*options.boundary.width/(options.sizeU-1),
        lat:options.boundary.lat+j*options.boundary.height/(options.sizeV-1),
      }
      row.push(idwInterpolation(pt, data, options.power))
    }
    grid.push(row)
  }
  return grid
}
// let data = [];
// for(let j=0;j<250;j++){
//   for(let i=0;i<150;i++){
//     data.push({
//       lng:100+20*Math.random(),
//       lat:20+40*Math.random(),
//       value:Math.random()*100,
//     })
//   }
// }
// console.time('离散点网格化压力测试');
// let grid = interpolate(data,{sizeU:141,sizeV:71})
// console.timeEnd('离散点网格化压力测试');//18889.673095703125 ms