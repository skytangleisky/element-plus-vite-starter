<template>
  <div id="map" class="map" style="position: absolute;left:0;top:0;width:100vw;height:100vh;"></div>
  <div style="position: absolute;left:0;top:0;background-color: #2b2b2b;">
    <div>Current sighting: <span id="info"></span></div>
    <div>
      <label for="shape-filter">Filter by UFO shape:</label>
      <select id="shape-filter"></select>
    </div>
  </div>

  <div id="popup" class="ol-popup">
    <a href="#" id="popup-closer" class="ol-popup-closer"></a>
    <div id="popup-content"></div>
  </div>
</template>
<script setup>
import {onMounted,onBeforeUnmount} from 'vue'
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import Point from 'ol/geom/Point';
import TileLayer from 'ol/layer/WebGLTile';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
import WebGLPointsLayer from 'ol/layer/WebGLPoints';
import XYZ from 'ol/source/XYZ';
import {fromLonLat,toLonLat} from 'ol/proj';
import 'ol/ol.css';
import Overlay from 'ol/Overlay'
import {toStringHDMS} from 'ol/coordinate';
import ufo_sighting_data from './data/ufo_sighting_data.csv?url'
// import ufo_shapes from './data/ufo_shapes.png?url'
import ufo_shapes from '../../assets/feather.svg?url'
// import ufo_shapes from '../../assets/feather.png?url'
import circle from '../../assets/circle.png?url'
let aid
onMounted(()=>{
  /**
   * Elements that make up the popup.
   */
  const container = document.getElementById('popup');
  const content = document.getElementById('popup-content');
  const closer = document.getElementById('popup-closer');

  /**
   * Create an overlay to anchor the popup to the map.
   */
  const overlay = new Overlay({
    element: container,
    autoPan: {
      animation: {
        duration: 250,
      },
    },
  });
  closer.onclick=function(){
    overlay.setPosition(undefined)
    closer.blur();
    return false
  }



  const attributions =
    '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
    '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';

  const map = new Map({
    overlays:[overlay],
    layers: [
      new TileLayer({
        preload: Infinity,
        // source: new XYZ({
        //   attributions: attributions,
        //   url: 'https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=' + "Get your own API key at https://www.maptiler.com/cloud/",
        //   tileSize: 512,
        // }),
        source: new XYZ({
          // attributions: attributions,
          url: 'https://gac-geo.googlecnapps.cn/maps/vt?lyrs=y&gl=CN&x={x}&y={y}&z={z}',
          tileSize: 256,
        }),
      }),
    ],
    target: document.getElementById('map'),
    view: new View({
      center: [0, 4000000],
      zoom: 2,
    }),
  });

  const oldColor = [255, 160, 110];
  const newColor = [180, 255, 200];

  const style = {
    variables: {
      filterShape: 'all',
    },
    filter: [
      'any',
      ['==', ['var', 'filterShape'], 'all'],
      ['==', ['var', 'filterShape'], ['get', 'shape']],
    ],
    symbol: {
      symbolType: 'image',
      src: ufo_shapes,
      size: [16,32],
      color: [
        'interpolate',
        ['linear'],
        ['get', 'year'],
        1950,
        oldColor,
        2013,
        newColor,
      ],
      rotateWithView: true,
      rotation:[
        'interpolate',
        ['linear'],
        ['get', 'deg'],
        -90,
        -90,
        90,
        90,
      ],
      offset: [6, 16],
      textureCoord:
      [1/10, 1/4, 1/10+16/(16*10+20*(10-1)), 1/4+32/(32*4+20*(4-1))]
      // [
      //   'match',
      //   ['get', 'shape'],
      //   'light',
      //   [0, 0, 0.25, 0.5],
      //   'sphere',
      //   [0.25, 0, 0.5, 0.5],
      //   'circle',
      //   [0.25, 0, 0.5, 0.5],
      //   'disc',
      //   [0.5, 0, 0.75, 0.5],
      //   'oval',
      //   [0.5, 0, 0.75, 0.5],
      //   'triangle',
      //   [0.75, 0, 1, 0.5],
      //   'fireball',
      //   [0, 0.5, 0.25, 1],
      //   [0.75, 0.5, 1, 1],
      // ],
    },
  }

  const style2 = {
    variables: {
      filterShape: 'all',
    },
    filter: [
      'any',
      ['==', ['var', 'filterShape'], 'all'],
      ['==', ['var', 'filterShape'], ['get', 'shape']],
    ],
    symbol: {
      symbolType: 'image',
      src: circle,
      size: 5,
      color: 'white',
      textureCoord:
      [0, 0, 1, 1]
      // [
      //   'match',
      //   ['get', 'shape'],
      //   'light',
      //   [0, 0, 0.25, 0.5],
      //   'sphere',
      //   [0.25, 0, 0.5, 0.5],
      //   'circle',
      //   [0.25, 0, 0.5, 0.5],
      //   'disc',
      //   [0.5, 0, 0.75, 0.5],
      //   'oval',
      //   [0.5, 0, 0.75, 0.5],
      //   'triangle',
      //   [0.75, 0, 1, 0.5],
      //   'fireball',
      //   [0, 0.5, 0.25, 1],
      //   [0.75, 0.5, 1, 1],
      // ],
    },
  }

  const shapeSelect = document.getElementById('shape-filter');
  shapeSelect.addEventListener('input', function () {
    style.variables.filterShape = shapeSelect.value;
    map.render();
  });
  function fillShapeSelect(shapeTypes) {
    Object.keys(shapeTypes)
      .sort(function (a, b) {
        return shapeTypes[b] - shapeTypes[a];
      })
      .forEach(function (shape) {
        const option = document.createElement('option');
        const sightings = shapeTypes[shape];
        option.text = `${shape} (${sightings} sighting${
          sightings === 1 ? '' : 's'
        })`;
        option.value = shape;
        shapeSelect.appendChild(option);
      });
  }

  const client = new XMLHttpRequest();
  client.open('GET', ufo_sighting_data);
  client.addEventListener('load', function () {
    const csv = client.responseText;
    // key is shape name, value is sightings count
    const shapeTypes = {};
    const features = [];
    let prevIndex = csv.indexOf('\n') + 1; // scan past the header line
    let curIndex;
    while ((curIndex = csv.indexOf('\n', prevIndex)) !== -1) {
      const line = csv.substring(prevIndex, curIndex).split(',');
      prevIndex = curIndex + 1;

      const coords = [parseFloat(line[5]), parseFloat(line[4])];
      const shape = line[2];
      shapeTypes[shape] = (shapeTypes[shape] || 0) + 1;

      features.push(
        new Feature({
          datetime: line[0],
          year: parseInt(/[0-9]{4}/.exec(line[0])[0], 10), // extract the year as int
          shape: shape,
          duration: line[3],
          deg:Math.PI/180*parseFloat(line[4]),
          coords,
          geometry: new Point(fromLonLat(coords)),
        })
      )
    }
    shapeTypes['all'] = features.length;

    map.addLayer(
      new WebGLPointsLayer({
        source: new VectorSource({
          features: features,
          // attributions: 'National UFO Reporting Center',
        }),
        style: style2,
      })
    );
    map.addLayer(
      new WebGLPointsLayer({
        source: new VectorSource({
          features: features,
          // attributions: 'National UFO Reporting Center',
        }),
        style: style,
      })
    )
    fillShapeSelect(shapeTypes);
  });
  client.send();

  const info = document.getElementById('info');
  map.on('pointerdown', function (evt) {
    if (map.getView().getInteracting() || map.getView().getAnimating()) {
      return;
    }
    const text = map.forEachFeatureAtPixel(evt.pixel, function (feature) {

      const coordinate = evt.coordinate;
      const hdms = toStringHDMS(toLonLat(coordinate));
      content.innerHTML = '<p>You clicked here:</p><span style="color:#e83e8c;">' + hdms + '</span>';
      overlay.setPosition(fromLonLat(feature.get('coords')));

      const datetime = feature.get('datetime');
      const duration = feature.get('duration');
      const shape = feature.get('shape');
      return `On ${datetime}, lasted ${duration} seconds and had a "${shape}" shape.`;
    });
    info.innerText = text || '';
  });
  function animate() {
    map.render();
    aid = window.requestAnimationFrame(animate);
  }
  // animate();
})
onBeforeUnmount(()=>{
  cancelAnimationFrame(aid)
})
</script>

<style>
.ol-popup {
  position: absolute;
  background-color: white;
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #cccccc;
  bottom: 12px;
  left: -50px;
  min-width: 280px;
  color: black;
}
.ol-popup:after, .ol-popup:before {
  top: 100%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}
.ol-popup:after {
  border-top-color: white;
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}
.ol-popup:before {
  border-top-color: #cccccc;
  border-width: 11px;
  left: 48px;
  margin-left: -11px;
}
.ol-popup-closer {
  text-decoration: none;
  position: absolute;
  top: 2px;
  right: 8px;
}
.ol-popup-closer:after {
  content: "✖";
}
</style>