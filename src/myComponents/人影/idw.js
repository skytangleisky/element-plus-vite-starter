const RADIUS = 6371008.8
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = RADIUS; // 地球半径，单位为千米
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // 距离，单位为米
  return distance;
}
function idwInterpolation(targetLon,targetLat, points, power) {
  let numerator = 0;
  let denominator = 0;

  points.forEach(point => {
      const distance = calculateDistance(targetLat, targetLon, point.lat, point.lng);
      const weight = 1 / Math.pow(distance, power);
      numerator += weight * point.value;
      denominator += weight;
  });

  return numerator / denominator;
}
export default function interpolate(data, options={sizeU:10,sizeV:10,boundary:{x:0,y:0,width:30,height:40},power:2}){
  let arr = []
  for(let j=0;j<options.sizeV;j++){
    let row = []
    for(let i=0;i<options.sizeU;i++){
      let x = options.boundary.x+i*options.boundary.width/(options.sizeU-1);
      let y = options.boundary.y+j*options.boundary.height/(options.sizeV-1);
      row.push(idwInterpolation(x, y, data, options.power))
    }
    arr.push(row)
  }
  return arr
}