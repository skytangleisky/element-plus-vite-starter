import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import {Fill, RegularShape, Stroke, Style} from 'ol/style.js';
import {fromLonLat} from 'ol/proj.js';

const shaft = new RegularShape({
  points: 2,
  radius: 5,
  stroke: new Stroke({
    width: 2,
    color: 'black',
  }),
  rotateWithView: true,
});

const head = new RegularShape({
  points: 3,
  radius: 5,
  fill: new Fill({
    color: 'black',
  }),
  rotateWithView: true,
});

const styles = [new Style({image: shaft}), new Style({image: head})];

const source = new VectorSource({
  attributions:
    'Weather data by <a href="https://openweathermap.org/current">OpenWeather</a>',
});

export const windArrowLayer = new VectorLayer({
  source: source,
  style: function (feature) {
    const wind = feature.get('wind');
    // rotate arrow away from wind origin
    const angle = ((wind.deg - 180) * Math.PI) / 180;
    const scale = wind.speed / 10;
    shaft.setScale([1, scale]);
    shaft.setRotation(angle);
    head.setDisplacement([
      0,
      head.getRadius() / 2 + shaft.getRadius() * scale,
    ]);
    head.setRotation(angle);
    return styles;
  },
})
const features = [];
for(let i=0;i<100;i++){
  const feature = new Feature(
    new Point(fromLonLat([110+Math.random()*10, 30+Math.random()*10]))
  );
  feature.setProperties({wind:{speed:Math.random()*30,deg:Math.random()*360}});
  features.push(feature);
}
source.addFeatures(features);
// map.getView().fit(source.getExtent());
