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