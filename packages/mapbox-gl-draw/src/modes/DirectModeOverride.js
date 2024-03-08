import * as Constants from '../constants';
import distance from '@turf/distance'
import * as turfHelpers from '@turf/helpers'
import circle from '@turf/circle'
import direct_select from './direct_select.js'
import moveFeatures from '../lib/move_features';
import createSupplementaryPoints from '../lib/create_supplementary_points';
import constrainFeatureMovement from '../lib/constrain_feature_movement';
import createSupplementaryPointsForCircle from '../utils/create_supplementary_points_circle';


const DirectModeOverride = direct_select;

DirectModeOverride.dragFeature = function(state, e, delta) {
  moveFeatures(this.getSelected(), delta);
  this.getSelected()
    .filter(feature => feature.properties.isCircle)
    .map(circle => circle.properties.center)
    .forEach(center => {
      center[0] += delta.lng;
      center[1] += delta.lat;
    });
  state.dragMoveLocation = e.lngLat;
};

DirectModeOverride.dragVertex = function(state, e, delta) {
  if (state.feature.properties.isCircle) {
    const center = state.feature.properties.center;
    const movedVertex = [e.lngLat.lng, e.lngLat.lat];
    const radius = distance(turfHelpers.point(center), turfHelpers.point(movedVertex), {units: 'kilometers'});
    const circleFeature = circle(center, radius);
    console.log('修改圆=>>>',circleFeature)
    state.feature.incomingCoords(circleFeature.geometry.coordinates);
    state.feature.properties.radiusInKm = radius;
  } else {
    const selectedCoords = state.selectedCoordPaths.map(coord_path => state.feature.getCoordinate(coord_path));
    const selectedCoordPoints = selectedCoords.map(coords => ({
      type: Constants.geojsonTypes.FEATURE,
      properties: {},
      geometry: {
        type: Constants.geojsonTypes.POINT,
        coordinates: coords
      }
    }));

    const constrainedDelta = constrainFeatureMovement(selectedCoordPoints, delta);
    for (let i = 0; i < selectedCoords.length; i++) {
      const coord = selectedCoords[i];
      state.feature.updateCoordinate(state.selectedCoordPaths[i], coord[0] + constrainedDelta.lng, coord[1] + constrainedDelta.lat);
    }
  }
};

DirectModeOverride.toDisplayFeatures = function (state, geojson, push) {
  if (state.featureId === geojson.properties.id) {
    geojson.properties.active = Constants.activeStates.ACTIVE;
    push(geojson);
    const supplementaryPoints = geojson.properties.user_isCircle ? createSupplementaryPointsForCircle(geojson, {
      map: this.map,
      midpoints: true,
      selectedPaths: state.selectedCoordPaths
    }):createSupplementaryPoints(geojson, {
      map: this.map,
      midpoints: true,
      selectedPaths: state.selectedCoordPaths
    })
    supplementaryPoints.forEach(push)
  } else {
    geojson.properties.active = Constants.activeStates.INACTIVE;
    push(geojson);
  }
  this.fireActionable(state);
}

export default DirectModeOverride