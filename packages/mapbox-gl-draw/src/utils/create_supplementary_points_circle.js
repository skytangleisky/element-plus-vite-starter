import createVertex from '../lib/create_vertex';

function createSupplementaryPointsForCircle(geojson,options={}) {
  const { properties, geometry } = geojson;

  if (!properties.user_isCircle) return null;

  const supplementaryPoints = [];
  const vertices = geometry.coordinates[0].slice(0, -1);
  for (let index = 0; index < vertices.length; index += Math.round((vertices.length / 4))) {
    supplementaryPoints.push(createVertex(properties.id, vertices[index], `0.${index}`, isSelectedPath(`0.${index}`)));
  }
  function isSelectedPath(path) {
    if (!options.selectedPaths) return false;
    return options.selectedPaths.indexOf(path) !== -1;
  }
  return supplementaryPoints;
}

export default createSupplementaryPointsForCircle
