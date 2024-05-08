export function BSpline(points,N=10){
  let pts = points.slice()
  if(N==0){
    return pts;
  }
  var arr = [];
  if(pts.length<3)
    return pts;
  else{
    if(JSON.stringify(pts[0])==JSON.stringify(pts.slice(-1)[0])){//闭合曲线
      pts.unshift(pts.slice(-3)[0],pts.slice(-3)[1]);
      // pts.push(pts[1],pts[2]);
    }else{//非闭合曲线
      pts.unshift(pts[0],pts[0]);
      pts.push(pts.slice(-1)[0],pts.slice(-1)[0]);
    }
  }
  for (let n = 0; n < pts.length - 3; n++) {
    for (let i = 0; i <= N; i++) {
      let t = i/N
      var a1 = Math.pow((1 - t), 3) / 6;
      var a2 = (3 * Math.pow(t, 3) - 6 * Math.pow(t, 2) + 4) / 6;
      var a3 = (-3 * Math.pow(t, 3) + 3 * Math.pow(t, 2) + 3 * t + 1) / 6;
      var a4 = Math.pow(t, 3) / 6;
      var x = a1*pts[n][0] + a2*pts[n + 1][0] + a3*pts[n + 2][0] + a4*pts[n + 3][0];
      var y = a1*pts[n][1] + a2*pts[n + 1][1] + a3*pts[n + 2][1] + a4*pts[n + 3][1];
      arr.push([x,y]);
    }
  }
  return arr;
}





